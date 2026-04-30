import { supabase } from "@/integrations/supabase/client";

const SITE_EDIT_EVENT = "bb-site-edit-change";
type EditCallback = (content: string | null) => void;
const listeners = new Map<string, Set<EditCallback>>();
let syncChannel: ReturnType<typeof supabase.channel> | null = null;
let pollTimer: number | null = null;
let pollInFlight = false;

function notifyEdit(id: string, content: string | null) {
  listeners.get(id)?.forEach((callback) => callback(content));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SITE_EDIT_EVENT, { detail: { id, content } }));
  }
}

async function pollWatchedEdits() {
  const ids = Array.from(listeners.keys());
  if (!ids.length || pollInFlight) return;
  pollInFlight = true;
  try {
    const { data, error } = await supabase
      .from("site_edits")
      .select("id, content")
      .in("id", ids);
    if (error) return;

    const edits = new Map((data ?? []).map((row) => [row.id, row.content]));
    ids.forEach((id) => {
      const content = edits.get(id) ?? null;
      try {
        if (content === null) localStorage.removeItem(id);
        else localStorage.setItem(id, content);
      } catch {
        // Ignore local cache failures.
      }
      listeners.get(id)?.forEach((callback) => callback(content));
    });
  } finally {
    pollInFlight = false;
  }
}

function ensureLiveSync() {
  if (syncChannel) return;

  syncChannel = supabase
    .channel("site-edits-live-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_edits" },
      (payload) => {
        const row = payload.eventType === "DELETE" ? payload.old : payload.new;
        const id = typeof row?.id === "string" ? row.id : null;
        if (!id || !listeners.has(id)) return;
        const content = payload.eventType === "DELETE" ? null : ((payload.new as { content?: string }).content ?? null);
        try {
          if (content === null) localStorage.removeItem(id);
          else localStorage.setItem(id, content);
        } catch {
          // Ignore local cache failures.
        }
        notifyEdit(id, content);
      }
    )
    .subscribe();

  if (typeof window !== "undefined") {
    pollTimer = window.setInterval(pollWatchedEdits, 5000);
  }
}

export function subscribeToEdit(id: string, callback: EditCallback): () => void {
  const callbacks = listeners.get(id) ?? new Set<EditCallback>();
  callbacks.add(callback);
  listeners.set(id, callbacks);
  ensureLiveSync();

  const onLocalEdit = (event: Event) => {
    const detail = (event as CustomEvent<{ id: string; content: string | null }>).detail;
    if (detail?.id === id) callback(detail.content);
  };
  window.addEventListener(SITE_EDIT_EVENT, onLocalEdit);

  return () => {
    callbacks.delete(callback);
    window.removeEventListener(SITE_EDIT_EVENT, onLocalEdit);
    if (callbacks.size === 0) listeners.delete(id);
    if (listeners.size === 0 && pollTimer !== null) {
      window.clearInterval(pollTimer);
      pollTimer = null;
    }
  };
}

/** Cheap admin check used to short-circuit write attempts from non-admins. */
async function currentUserIsAdmin(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

/** Load a saved edit from the database, falling back to localStorage for migration. */
export async function loadEdit(id: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("site_edits")
      .select("content")
      .eq("id", id)
      .maybeSingle();
    if (!error) {
      if (data?.content) {
        try { localStorage.setItem(id, data.content); } catch {
          // Ignore local cache failures.
        }
        return data.content;
      }
      try { localStorage.removeItem(id); } catch {
        // Ignore local cache failures.
      }
      return null;
    }
  } catch {
    // Fall back to local cache when the cloud request fails.
  }

  // Offline fallback only: use localStorage if the cloud request fails.
  return localStorage.getItem(id);
}

/** Save an edit to the database (upsert). Also keeps localStorage as a fast cache. */
export async function saveEdit(id: string, content: string): Promise<void> {
  // Only admins can persist edits. Skip entirely for everyone else.
  if (!(await currentUserIsAdmin())) return;

  try {
    localStorage.setItem(id, content);
    notifyEdit(id, content);
  } catch {
    notifyEdit(id, content);
  }

  try {
    await supabase.from("site_edits").upsert(
      { id, content, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
  } catch (err) {
    console.error("Failed to save edit to cloud:", err);
  }
}

/** Remove an edit. */
export async function removeEdit(id: string): Promise<void> {
  if (!(await currentUserIsAdmin())) return;
  try {
    localStorage.removeItem(id);
    notifyEdit(id, null);
  } catch {
    notifyEdit(id, null);
  }
  try {
    await supabase.from("site_edits").delete().eq("id", id);
  } catch {
    // Ignore remove failures; the local view has already been cleared.
  }
}
