import { supabase } from "@/integrations/supabase/client";

/** Load a saved edit from the database, falling back to localStorage for migration. */
export async function loadEdit(id: string): Promise<string | null> {
  try {
    const { data } = await supabase
      .from("site_edits")
      .select("content")
      .eq("id", id)
      .maybeSingle();
    if (data?.content) return data.content;
  } catch {}

  // Fallback: check localStorage (migrates old edits)
  const local = localStorage.getItem(id);
  if (local) {
    // Migrate to DB
    saveEdit(id, local).catch(() => {});
  }
  return local;
}

/** Save an edit to the database (upsert). Also keeps localStorage as a fast cache. */
export async function saveEdit(id: string, content: string): Promise<void> {
  try {
    localStorage.setItem(id, content);
  } catch {}

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
  try { localStorage.removeItem(id); } catch {}
  try {
    await supabase.from("site_edits").delete().eq("id", id);
  } catch {}
}
