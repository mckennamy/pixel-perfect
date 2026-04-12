import { useState, useEffect } from "react";
import { Lock, Download, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";

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

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [filter, setFilter] = useState<"all" | "unpaid" | "deposit_paid" | "fully_paid">("all");

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "yes") {
      setAuthed(true);
      loadReservations();
    }
  }, []);

  const loadReservations = () => {
    const data = JSON.parse(localStorage.getItem("wedding_reservations") || "[]");
    setReservations(data);
  };

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "yes");
      setAuthed(true);
      loadReservations();
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
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-burg/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={20} className="text-burg" />
            </div>
            <p className="section-kicker mb-1">Admin Access</p>
            <h1 className="font-display text-3xl italic text-burg">Becoming Bradley</h1>
          </div>
          <div className="bg-white border border-parchment-d p-6 rounded-sm shadow-sm">
            <label className="block font-kicker text-[0.58rem] tracking-widest uppercase text-ink-mid mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Enter admin password"
              className="w-full font-body text-sm bg-parchment/40 border border-parchment-d rounded-sm px-3 py-2.5 mb-3 focus:outline-none focus:ring-1 focus:ring-burg/40"
            />
            {error && <p className="font-body text-xs text-red-600 mb-3">{error}</p>}
            <button
              onClick={login}
              className="w-full font-kicker text-[0.6rem] tracking-[0.3em] uppercase py-3 bg-burg text-white hover:bg-burg-mid transition-colors"
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
    <div className="page-wrapper px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="section-kicker mb-1">Admin Dashboard</p>
            <h1 className="font-display text-3xl italic text-burg">Becoming Bradley</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 font-kicker text-[0.58rem] tracking-widest uppercase border border-chartreuse-dark text-chartreuse-dark px-4 py-2 hover:bg-chartreuse-dark hover:text-white transition-colors"
            >
              <Download size={12} /> Export CSV
            </button>
            <button
              onClick={() => { sessionStorage.removeItem("admin_authed"); setAuthed(false); }}
              className="font-kicker text-[0.58rem] tracking-widest uppercase border border-parchment-d text-ink-light px-4 py-2 hover:border-burg/40 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total RSVPs", value: stats.total, color: "text-burg" },
            { label: "Total Guests", value: stats.guests, color: "text-moss" },
            { label: "Fully Paid", value: stats.fullyPaid, color: "text-green-600" },
            { label: "Deposit Paid", value: stats.depositPaid, color: "text-chartreuse-dark" },
            { label: "Unpaid", value: stats.unpaid, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-parchment-d p-4 rounded-sm text-center shadow-sm">
              <p className={`font-display text-3xl italic ${s.color}`}>{s.value}</p>
              <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "unpaid", "deposit_paid", "fully_paid"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-kicker text-[0.55rem] tracking-widest uppercase px-4 py-2 border transition-colors ${
                filter === f
                  ? "bg-burg text-white border-burg"
                  : "border-parchment-d text-ink-light hover:border-burg/40"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Reservation list */}
          <div className="lg:col-span-2">
            {filtered.length === 0 ? (
              <div className="bg-white border border-parchment-d p-8 rounded-sm text-center">
                <p className="font-body text-sm italic text-ink-light">No reservations yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((r) => {
                  const ps = r.paymentStatus || "unpaid";
                  const statusIcon =
                    ps === "fully_paid" ? <CheckCircle size={12} className="text-green-600" /> :
                    ps === "deposit_paid" ? <Clock size={12} className="text-chartreuse-dark" /> :
                    <XCircle size={12} className="text-red-400" />;

                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className={`w-full text-left bg-white border p-4 rounded-sm shadow-sm transition-colors ${selected?.id === r.id ? "border-burg" : "border-parchment-d hover:border-burg/40"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-body text-sm text-ink font-medium">{r.primaryName}</p>
                          <p className="font-body text-xs text-ink-light">{r.email}</p>
                          <p className="font-body text-xs text-ink-light mt-1">
                            {r.guests.length} guest{r.guests.length !== 1 ? "s" : ""} ·{" "}
                            {r.accommodationPreference.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {statusIcon}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-white border border-parchment-d rounded-sm shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="section-kicker mb-1">Reservation Detail</p>
                    <h2 className="font-display text-2xl italic text-burg">{selected.primaryName}</h2>
                    <p className="font-body text-xs text-ink-light">
                      Submitted {new Date(selected.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <button onClick={() => deleteReservation(selected.id)} className="text-ink-light hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Contact */}
                <div className="grid sm:grid-cols-2 gap-3 mb-5 text-sm">
                  <div><p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-0.5">Email</p><p className="font-body text-ink">{selected.email}</p></div>
                  <div><p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-0.5">Phone</p><p className="font-body text-ink">{selected.phone}</p></div>
                  <div><p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-0.5">Accommodation</p><p className="font-body text-ink capitalize">{selected.accommodationPreference.replace(/_/g, " ")}</p></div>
                  <div><p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-0.5">Linen Service</p><p className="font-body text-ink capitalize">{selected.linenService || "N/A"}</p></div>
                </div>

                {/* Guests */}
                <div className="mb-5">
                  <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-2">Party ({selected.guests.length})</p>
                  <div className="flex flex-col gap-1">
                    {selected.guests.map((g, i) => (
                      <div key={i} className="flex items-center gap-2 font-body text-sm text-ink">
                        <span className="text-chartreuse-dark text-xs">✦</span>
                        {g.fullName}
                        {g.dietaryRestrictions && <span className="text-xs text-ink-light italic">— {g.dietaryRestrictions}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flights */}
                {(selected.flightArrivalDate || selected.flightDepartureDate) && (
                  <div className="mb-5 grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-1">Arrival</p>
                      <p className="font-body text-xs text-ink">{selected.flightArrivalDate} · {selected.flightArrivalNumber}</p>
                      <p className="font-body text-xs text-ink-light">From: {selected.flightArrivalFrom}</p>
                    </div>
                    <div>
                      <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-1">Departure</p>
                      <p className="font-body text-xs text-ink">{selected.flightDepartureDate} · {selected.flightDepartureNumber}</p>
                      <p className="font-body text-xs text-ink-light">To: {selected.flightDepartureTo}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selected.notes && (
                  <div className="mb-5 p-3 bg-parchment/40 rounded-sm border border-parchment-d">
                    <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-1">Notes</p>
                    <p className="font-body text-sm text-ink-mid italic">{selected.notes}</p>
                  </div>
                )}

                {/* Payment status */}
                <div>
                  <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-2">Payment Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["unpaid", "deposit_paid", "fully_paid"] as const).map((ps) => (
                      <button
                        key={ps}
                        onClick={() => updatePaymentStatus(selected.id, ps)}
                        className={`font-kicker text-[0.55rem] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                          (selected.paymentStatus || "unpaid") === ps
                            ? ps === "fully_paid" ? "bg-green-600 text-white border-green-600"
                              : ps === "deposit_paid" ? "bg-chartreuse-dark text-white border-chartreuse-dark"
                              : "bg-red-500 text-white border-red-500"
                            : "border-parchment-d text-ink-light hover:border-burg/40"
                        }`}
                      >
                        {ps.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-parchment/40 border border-parchment-d rounded-sm p-8 text-center">
                <p className="font-body text-sm italic text-ink-light">
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
