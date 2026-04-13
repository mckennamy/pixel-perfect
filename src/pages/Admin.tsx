import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "bradley2027";

interface Reservation {
  id: string;
  submittedAt: string;
  primaryName: string;
  email: string;
  phone: string;
  guests: { fullName: string; dietaryRestrictions?: string }[];
  paymentOption: "deposit_50" | "full_payment";
  accommodationPreference: string;
  linenService?: string;
  flightArrivalDate?: string;
  flightArrivalNumber?: string;
  flightArrivalFrom?: string;
  flightDepartureDate?: string;
  flightDepartureNumber?: string;
  flightDepartureTo?: string;
  notes?: string;
  status: string;
  paid: string;
  paymentStatus?: "unpaid" | "deposit_paid" | "fully_paid";
}

const inputClass =
  "w-full font-body text-sm bg-white border border-[hsl(var(--border))] px-3 py-2.5 focus:outline-none focus:border-[hsl(var(--burg-mid))] placeholder:text-[hsl(var(--stone-light))] text-[hsl(var(--ink))]";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [filter, setFilter] = useState<"all" | "unpaid" | "deposit_paid" | "fully_paid">("all");
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    // Show badge on login page too
    const n = parseInt(localStorage.getItem("admin_new_count") || "0", 10);
    setNewCount(n);
    if (sessionStorage.getItem("admin_authed") === "yes") {
      setAuthed(true);
      loadReservations();
      clearBadge();
    }
  }, []);

  const clearBadge = () => {
    localStorage.setItem("admin_new_count", "0");
    setNewCount(0);
  };

  const loadReservations = () => {
    const data = JSON.parse(localStorage.getItem("wedding_reservations") || "[]");
    setReservations(data);
  };

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "yes");
      setAuthed(true);
      loadReservations();
      clearBadge();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  const updatePaymentStatus = (id: string, status: Reservation["paymentStatus"]) => {
    const updated = reservations.map((r) =>
      r.id === id ? { ...r, paymentStatus: status } : r
    );
    setReservations(updated);
    localStorage.setItem("wedding_reservations", JSON.stringify(updated));
    if (selected?.id === id) setSelected({ ...selected, paymentStatus: status });
  };

  const deleteReservation = (id: string) => {
    if (!confirm("Delete this reservation?")) return;
    const updated = reservations.filter((r) => r.id !== id);
    setReservations(updated);
    localStorage.setItem("wedding_reservations", JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  };

  const exportCSV = () => {
    const headers = [
      "Submitted", "Name", "Email", "Phone", "Guests", "Payment Option",
      "Accommodation", "Linen", "Arrival Date", "Arrival Flight", "From",
      "Departure Date", "Departure Flight", "To", "Notes", "Payment Status",
    ];
    const rows = reservations.map((r) => [
      new Date(r.submittedAt).toLocaleDateString(),
      r.primaryName,
      r.email,
      r.phone,
      r.guests.map((g) => g.fullName).join("; "),
      r.paymentOption === "full_payment" ? "Full Payment" : "50% Deposit",
      r.accommodationPreference,
      r.linenService || "N/A",
      r.flightArrivalDate || "",
      r.flightArrivalNumber || "",
      r.flightArrivalFrom || "",
      r.flightDepartureDate || "",
      r.flightDepartureNumber || "",
      r.flightDepartureTo || "",
      r.notes || "",
      r.paymentStatus || "unpaid",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `becoming-bradley-reservations-${Date.now()}.csv`;
    a.click();
  };

  const filtered = reservations.filter((r) => {
    if (filter === "all") return true;
    return (r.paymentStatus || "unpaid") === filter;
  });

  const stats = {
    total: reservations.length,
    guests: reservations.reduce((acc, r) => acc + r.guests.length, 0),
    fullyPaid: reservations.filter((r) => r.paymentStatus === "fully_paid").length,
    depositPaid: reservations.filter((r) => r.paymentStatus === "deposit_paid").length,
    unpaid: reservations.filter((r) => !r.paymentStatus || r.paymentStatus === "unpaid").length,
  };

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <p className="kicker mb-4">Admin Access</p>
            <h1
              className="font-display italic text-burg"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
            >
              Becoming Bradley
            </h1>
            {newCount > 0 && (
              <p
                className="kicker mt-3"
                style={{ color: "#dc2626", fontSize: "0.52rem" }}
              >
                {newCount} new reservation{newCount !== 1 ? "s" : ""} awaiting review
              </p>
            )}
            <span className="rule mt-6 block" />
          </div>
          <div className="p-8" style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--parchment))" }}>
            <p className="kicker mb-3">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Enter admin password"
              className={inputClass + " mb-3"}
            />
            {error && <p className="font-body text-xs text-red-600 mb-4">{error}</p>}
            <button
              onClick={login}
              className="w-full kicker py-3 transition-colors"
              style={{ background: "hsl(var(--burg))", color: "hsl(var(--cream))" }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ──
  return (
    <div className="page-wrapper px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="kicker mb-3">Admin Dashboard</p>
            <div className="flex items-center gap-4">
              <h1 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
                Becoming Bradley
              </h1>
              {newCount > 0 && (
                <span
                  className="kicker flex-shrink-0"
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.52rem",
                    borderRadius: 2,
                  }}
                >
                  {newCount} new
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="kicker px-5 py-2.5 transition-colors"
              style={{ border: "1px solid hsl(var(--chart))", color: "hsl(var(--chart-mid))" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--chart))"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--chart-mid))"; }}
            >
              Export CSV
            </button>
            <button
              onClick={() => { sessionStorage.removeItem("admin_authed"); setAuthed(false); }}
              className="kicker px-5 py-2.5 transition-colors"
              style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--stone))" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--burg-light))"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))"}
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="rule-full mb-8" />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-px mb-10" style={{ background: "hsl(var(--border))" }}>
          {[
            { label: "Total RSVPs",   value: stats.total,       color: "hsl(var(--burg))" },
            { label: "Total Guests",  value: stats.guests,      color: "hsl(var(--moss))" },
            { label: "Fully Paid",    value: stats.fullyPaid,   color: "#16a34a" },
            { label: "Deposit Paid",  value: stats.depositPaid, color: "hsl(var(--chart-mid))" },
            { label: "Unpaid",        value: stats.unpaid,      color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="text-center py-8 px-4" style={{ background: "hsl(var(--cream))" }}>
              <p className="font-display italic leading-none mb-2" style={{ fontSize: "2.5rem", fontWeight: 300, color: s.color }}>
                {s.value}
              </p>
              <p className="kicker">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(["all", "unpaid", "deposit_paid", "fully_paid"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="kicker px-5 py-2 transition-colors"
              style={{
                border: "1px solid hsl(var(--border))",
                background: filter === f ? "hsl(var(--burg))" : "transparent",
                color: filter === f ? "hsl(var(--cream))" : "hsl(var(--stone))",
                borderColor: filter === f ? "hsl(var(--burg))" : "hsl(var(--border))",
              }}
            >
              {f.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Reservation list */}
          <div className="lg:col-span-2 space-y-px" style={{ background: "hsl(var(--border))" }}>
            {filtered.length === 0 ? (
              <div className="p-10 text-center" style={{ background: "hsl(var(--cream))" }}>
                <p className="font-body text-sm italic text-[hsl(var(--stone))]">No reservations yet.</p>
              </div>
            ) : (
              filtered.map((r) => {
                const ps = r.paymentStatus || "unpaid";
                const statusColor =
                  ps === "fully_paid"   ? "#16a34a" :
                  ps === "deposit_paid" ? "hsl(var(--chart-mid))" :
                                          "#dc2626";
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="w-full text-left p-5 transition-colors"
                    style={{
                      background: selected?.id === r.id ? "hsl(var(--burg-pale))" : "hsl(var(--cream))",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-body text-sm text-[hsl(var(--ink))]">{r.primaryName}</p>
                        <p className="font-body text-xs text-[hsl(var(--stone))]">{r.email}</p>
                        <p className="font-body text-xs text-[hsl(var(--stone))] mt-1">
                          {r.guests.length} guest{r.guests.length !== 1 ? "s" : ""}
                          {" · "}{r.accommodationPreference.replace(/_/g, " ")}
                        </p>
                      </div>
                      <span
                        className="kicker flex-shrink-0 mt-0.5"
                        style={{ color: statusColor, fontSize: "0.5rem" }}
                      >
                        {ps.replace(/_/g, " ")}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="p-8" style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--cream))" }}>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="kicker mb-2">Reservation Detail</p>
                    <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 300 }}>
                      {selected.primaryName}
                    </h2>
                    <p className="font-body text-xs text-[hsl(var(--stone))] mt-1">
                      Submitted {new Date(selected.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteReservation(selected.id)}
                    className="font-body text-xs text-[hsl(var(--stone))] hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="rule-full mb-6" />

                {/* Contact */}
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                  {[
                    { label: "Email",         value: selected.email },
                    { label: "Phone",         value: selected.phone },
                    { label: "Accommodation", value: selected.accommodationPreference.replace(/_/g, " ") },
                    { label: "Linen Service", value: selected.linenService || "N/A" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="kicker mb-1">{item.label}</p>
                      <p className="font-body text-sm text-[hsl(var(--ink))] capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rule-full mb-6" />

                {/* Guests */}
                <div className="mb-6">
                  <p className="kicker mb-3">Party ({selected.guests.length})</p>
                  <div className="space-y-1">
                    {selected.guests.map((g, i) => (
                      <div key={i} className="flex items-start gap-3 font-body text-sm text-[hsl(var(--ink))]">
                        <span className="text-[hsl(var(--stone-light))] flex-shrink-0 mt-0.5">—</span>
                        <span>
                          {g.fullName}
                          {g.dietaryRestrictions && (
                            <span className="text-xs italic text-[hsl(var(--stone))]"> · {g.dietaryRestrictions}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flights */}
                {(selected.flightArrivalDate || selected.flightDepartureDate) && (
                  <>
                    <div className="rule-full mb-6" />
                    <div className="grid sm:grid-cols-2 gap-5 mb-6">
                      <div>
                        <p className="kicker mb-1">Arrival</p>
                        <p className="font-body text-xs text-[hsl(var(--ink))]">
                          {selected.flightArrivalDate} · {selected.flightArrivalNumber}
                        </p>
                        <p className="font-body text-xs italic text-[hsl(var(--stone))]">From: {selected.flightArrivalFrom}</p>
                      </div>
                      <div>
                        <p className="kicker mb-1">Departure</p>
                        <p className="font-body text-xs text-[hsl(var(--ink))]">
                          {selected.flightDepartureDate} · {selected.flightDepartureNumber}
                        </p>
                        <p className="font-body text-xs italic text-[hsl(var(--stone))]">To: {selected.flightDepartureTo}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                {selected.notes && (
                  <>
                    <div className="rule-full mb-6" />
                    <div className="mb-6 p-4" style={{ background: "hsl(var(--parchment))", borderLeft: "2px solid hsl(var(--gold))" }}>
                      <p className="kicker mb-1">Notes</p>
                      <p className="font-body text-sm italic text-[hsl(var(--ink-mid))]">{selected.notes}</p>
                    </div>
                  </>
                )}

                <div className="rule-full mb-6" />

                {/* Payment status */}
                <div>
                  <p className="kicker mb-3">Payment Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["unpaid", "deposit_paid", "fully_paid"] as const).map((ps) => {
                      const isActive = (selected.paymentStatus || "unpaid") === ps;
                      const activeColor =
                        ps === "fully_paid"   ? "#16a34a" :
                        ps === "deposit_paid" ? "hsl(var(--chart))" :
                                                "#dc2626";
                      return (
                        <button
                          key={ps}
                          onClick={() => updatePaymentStatus(selected.id, ps)}
                          className="kicker px-4 py-2 transition-colors"
                          style={{
                            border: `1px solid ${isActive ? activeColor : "hsl(var(--border))"}`,
                            background: isActive ? activeColor : "transparent",
                            color: isActive ? "white" : "hsl(var(--stone))",
                          }}
                        >
                          {ps.replace(/_/g, " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center" style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--parchment))" }}>
                <p className="font-body text-sm italic text-[hsl(var(--stone))]">
                  Select a reservation to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
