import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

let cachedIsAdmin: boolean | null = null;
const listeners = new Set<(v: boolean) => void>();

function setGlobal(v: boolean) {
  cachedIsAdmin = v;
  listeners.forEach((l) => l(v));
}

async function checkAdmin(userId: string | undefined) {
  if (!userId) { setGlobal(false); return; }
  try {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setGlobal(!!data);
  } catch {
    setGlobal(false);
  }
}

let initialized = false;
function initOnce() {
  if (initialized) return;
  initialized = true;
  supabase.auth.onAuthStateChange((_event, session) => {
    checkAdmin(session?.user?.id);
  });
  supabase.auth.getSession().then(({ data: { session } }) => {
    checkAdmin(session?.user?.id);
  });
}

/** Returns true only when the signed-in user has the admin role. */
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState<boolean>(cachedIsAdmin ?? false);
  useEffect(() => {
    initOnce();
    listeners.add(setIsAdmin);
    if (cachedIsAdmin !== null) setIsAdmin(cachedIsAdmin);
    return () => { listeners.delete(setIsAdmin); };
  }, []);
  return isAdmin;
}
