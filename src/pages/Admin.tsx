import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const ADMIN_EMAIL = "mckennamy@gmail.com";

interface Guest {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  invite_tier: "standard" | "rehearsal";
  invite_sent_at: string | null;
  reservation_id: string | null;
  notes: string | null;
}

interface Reservation {
  id: string;
  primary_name: string;
  email: string;
  phone: string;
  guests: { fullName: string; dietaryRestrictions?: string }[];
  payment_option: string;
  accommodation_preference: string;
  payment_status: string;
  submitted_at: string;
  notes: string | null;
}

const inputClass =
  "w-full font-body text-sm bg-white border border-[hsl(var(--border))] px-3 py-2.5 focus:outline-none focus:border-[hsl(var(--burg-mid))] placeholder:text-[hsl(var(--stone-light))] text-[hsl(var(--ink))]";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"guests" | "reservations">("guests");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState({
    full_name: "",
    email: "",
    phone: "",
    invite_tier: "standard" as "standard" | "rehearsal",
  });

  // Auth state listener
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email } : null);
      if (session?.user) checkAdmin(session.user.id);
      else { setIsAdmin(false); setLoading(false); }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { email: session.user.email } : null);
      if (session?.user) checkAdmin(session.user.id);
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    const admin = !!data;
    setIsAdmin(admin);
    setLoading(false);
    if (admin) loadAll();
  };

  const loadAll = async () => {
    const [g, r] = await Promise.all([
      supabase.from("guests").select("*").order("full_name"),
      supabase.from("reservations").select("*").order("submitted_at", { ascending: false }),
    ]);
    if (g.data) setGuests(g.data as Guest[]);
    if (r.data) setReservations(r.data as Reservation[]);
  };

  const signIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) toast.error("Sign-in failed. Please try again.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const addGuest = async () => {
    if (!newGuest.full_name.trim()) { toast.error("Name required"); return; }
    const { error } = await supabase.from("guests").insert({
      full_name: newGuest.full_name.trim(),
      email: newGuest.email.trim() || null,
      phone: newGuest.phone.trim() || null,
      invite_tier: newGuest.invite_tier,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Guest added");
    setNewGuest({ full_name: "", email: "", phone: "", invite_tier: "standard" });
    setShowAddGuest(false);
    loadAll();
  };

  const removeGuest = async (id: string) => {
    if (!confirm("Remove this guest from the list?")) return;
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Guest removed");
    loadAll();
  };

  const toggleTier = async (g: Guest) => {
    const newTier = g.invite_tier === "standard" ? "rehearsal" : "standard";
    const { error } = await supabase.from("guests").update({ invite_tier: newTier }).eq("id", g.id);
    if (error) { toast.error(error.message); return; }
    loadAll();
  };

  const sendInvite = async (g: Guest) => {
    if (!g.email) { toast.error("Guest has no email on file"); return; }
    // For now mark as sent — actual email delivery requires email domain setup
    const { error } = await supabase
      .from("guests")
      .update({ invite_sent_at: new Date().toISOString() })
      .eq("id", g.id);
    if (error) { toast.error(error.message); return; }
    await supabase.from("email_log").insert({
      guest_id: g.id,
      recipient_email: g.email,
      email_type: "invite",
      invite_tier: g.invite_tier,
      status: "marked_sent",
    });
    toast.success(`Marked invite as sent to ${g.full_name}. Email delivery setup is the next step.`);
    loadAll();
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen">
        <p className="font-body italic text-stone">Loading…</p>
      </div>
    );
  }

  // ── Sign in ──
  if (!user) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-sm text-center">
          <p className="kicker mb-4">Admin Access</p>
          <h1 className="font-display italic text-burg mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
            Becoming Bradley
          </h1>
          <span className="rule mt-6 mb-8 block" />
          <p className="font-body text-sm italic text-stone mb-8">
            Sign in with the wedding organizer's Google account to access the dashboard.
          </p>
          <button
            onClick={signIn}
            className="w-full kicker py-3.5 transition-colors"
            style={{ background: "hsl(var(--burg))", color: "hsl(var(--cream))" }}
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  // ── Not admin ──
  if (!isAdmin) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-sm text-center">
          <p className="kicker mb-4" style={{ color: "#dc2626" }}>Access Denied</p>
          <h1 className="font-display italic text-burg mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 300 }}>
            This area is private
          </h1>
          <p className="font-body text-sm italic text-stone mb-6">
            Signed in as {user.email}. Only the wedding organizer can access this dashboard.
          </p>
          <button onClick={signOut} className="kicker px-5 py-2.5" style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--stone))" }}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  const stats = {
    invited: guests.length,
    sent: guests.filter((g) => g.invite_sent_at).length,
    rsvped: guests.filter((g) => g.reservation_id).length,
    rehearsal: guests.filter((g) => g.invite_tier === "rehearsal").length,
    reservations: reservations.length,
  };

  return (
    <div className="page-wrapper px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="kicker mb-3">Admin Dashboard</p>
            <h1 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
              Becoming Bradley
            </h1>
            <p className="font-body text-xs text-stone mt-1">{user.email}</p>
          </div>
          <button onClick={signOut} className="kicker px-5 py-2.5" style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--stone))" }}>
            Sign Out
          </button>
        </div>

        <div className="rule-full mb-8" />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-px mb-10" style={{ background: "hsl(var(--border))" }}>
          {[
            { label: "Invited",        value: stats.invited,      color: "hsl(var(--burg))" },
            { label: "Invites Sent",   value: stats.sent,         color: "hsl(var(--moss))" },
            { label: "RSVPs Received", value: stats.rsvped,       color: "#16a34a" },
            { label: "Rehearsal Tier", value: stats.rehearsal,    color: "hsl(var(--gold))" },
            { label: "Reservations",   value: stats.reservations, color: "hsl(var(--chart-mid))" },
          ].map((s) => (
            <div key={s.label} className="text-center py-8 px-4" style={{ background: "hsl(var(--cream))" }}>
              <p className="font-display italic leading-none mb-2" style={{ fontSize: "2.5rem", fontWeight: 300, color: s.color }}>
                {s.value}
              </p>
              <p className="kicker">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["guests", "reservations"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="kicker px-5 py-2"
              style={{
                border: "1px solid hsl(var(--border))",
                background: tab === t ? "hsl(var(--burg))" : "transparent",
                color: tab === t ? "hsl(var(--cream))" : "hsl(var(--stone))",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "guests" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="font-display italic text-burg text-2xl" style={{ fontWeight: 300 }}>
                Guest List ({guests.length})
              </p>
              <button
                onClick={() => setShowAddGuest(!showAddGuest)}
                className="kicker px-4 py-2"
                style={{ background: "hsl(var(--burg))", color: "hsl(var(--cream))" }}
              >
                {showAddGuest ? "Cancel" : "+ Add Guest"}
              </button>
            </div>

            {showAddGuest && (
              <div className="p-6 mb-6 grid sm:grid-cols-4 gap-3" style={{ background: "hsl(var(--parchment))", border: "1px solid hsl(var(--border))" }}>
                <input className={inputClass} placeholder="Full name *" value={newGuest.full_name} onChange={(e) => setNewGuest({ ...newGuest, full_name: e.target.value })} />
                <input className={inputClass} placeholder="Email" value={newGuest.email} onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })} />
                <input className={inputClass} placeholder="Phone" value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })} />
                <select className={inputClass} value={newGuest.invite_tier} onChange={(e) => setNewGuest({ ...newGuest, invite_tier: e.target.value as "standard" | "rehearsal" })}>
                  <option value="standard">Standard</option>
                  <option value="rehearsal">Rehearsal</option>
                </select>
                <div className="sm:col-span-4">
                  <button onClick={addGuest} className="kicker px-5 py-2.5" style={{ background: "hsl(var(--moss))", color: "hsl(var(--cream))" }}>
                    Save Guest
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto" style={{ border: "1px solid hsl(var(--border))" }}>
              <table className="w-full" style={{ background: "hsl(var(--cream))" }}>
                <thead>
                  <tr style={{ background: "hsl(var(--parchment))" }}>
                    {["Name", "Email", "Phone", "Tier", "Invite", "RSVP", ""].map((h) => (
                      <th key={h} className="kicker text-left px-4 py-3" style={{ borderBottom: "1px solid hsl(var(--border))" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-10 font-body italic text-stone">No guests yet — add your first guest above.</td></tr>
                  )}
                  {guests.map((g) => (
                    <tr key={g.id} style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                      <td className="font-body text-sm px-4 py-3 text-ink">{g.full_name}</td>
                      <td className="font-body text-xs px-4 py-3 text-stone">{g.email || "—"}</td>
                      <td className="font-body text-xs px-4 py-3 text-stone">{g.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleTier(g)}
                          className="kicker px-2 py-1"
                          style={{
                            background: g.invite_tier === "rehearsal" ? "hsl(var(--gold))" : "transparent",
                            color: g.invite_tier === "rehearsal" ? "white" : "hsl(var(--stone))",
                            border: "1px solid hsl(var(--border))",
                            fontSize: "0.5rem",
                          }}
                        >
                          {g.invite_tier}
                        </button>
                      </td>
                      <td className="font-body text-xs px-4 py-3">
                        {g.invite_sent_at ? (
                          <span style={{ color: "#16a34a" }}>✓ Sent</span>
                        ) : (
                          <button onClick={() => sendInvite(g)} className="kicker px-3 py-1" style={{ border: "1px solid hsl(var(--burg))", color: "hsl(var(--burg))" }}>
                            Send
                          </button>
                        )}
                      </td>
                      <td className="font-body text-xs px-4 py-3">
                        {g.reservation_id ? <span style={{ color: "#16a34a" }}>✓ Yes</span> : <span style={{ color: "#dc2626" }}>Pending</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => removeGuest(g.id)} className="font-body text-xs text-stone hover:text-red-600">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-5" style={{ background: "hsl(var(--gold-pale))", borderLeft: "2px solid hsl(var(--gold))" }}>
              <p className="kicker mb-2">Email Delivery</p>
              <p className="font-body text-sm italic text-ink-mid">
                Email sending requires a verified sender domain. Ask Lovable to "set up email sending" to activate beautifully branded invites and reminders to your guests' inboxes — with a separate version for rehearsal-tier guests.
              </p>
            </div>
          </div>
        )}

        {tab === "reservations" && (
          <div>
            <p className="font-display italic text-burg text-2xl mb-6" style={{ fontWeight: 300 }}>
              Reservations ({reservations.length})
            </p>
            <div className="space-y-3">
              {reservations.length === 0 && (
                <p className="font-body italic text-stone text-center py-10">No reservations submitted yet.</p>
              )}
              {reservations.map((r) => (
                <div key={r.id} className="p-5" style={{ background: "hsl(var(--cream))", border: "1px solid hsl(var(--border))" }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display italic text-burg text-xl" style={{ fontWeight: 300 }}>{r.primary_name}</p>
                      <p className="font-body text-xs text-stone">{r.email} · {r.phone}</p>
                    </div>
                    <span className="kicker px-2 py-1" style={{
                      background: r.payment_status === "fully_paid" ? "#16a34a" : r.payment_status === "deposit_paid" ? "hsl(var(--chart-mid))" : "#dc2626",
                      color: "white", fontSize: "0.5rem",
                    }}>{r.payment_status.replace(/_/g, " ")}</span>
                  </div>
                  <p className="font-body text-sm text-ink-mid">
                    {r.guests.length} guest{r.guests.length !== 1 ? "s" : ""} · {r.accommodation_preference.replace(/_/g, " ")} · {r.payment_option.replace(/_/g, " ")}
                  </p>
                  <p className="font-body text-xs text-stone mt-1">
                    Submitted {new Date(r.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}