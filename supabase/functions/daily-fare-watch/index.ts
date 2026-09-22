import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ORIGINS = [
  { code: "IND", label: "Indianapolis (IND)" },
  { code: "ORD", label: "Chicago O'Hare (ORD)" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

    const { data: existing } = await supabase
      .from("fare_watch")
      .select("id")
      .eq("checked_on", today)
      .limit(1);
    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ ok: true, skipped: "already updated today" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Today is ${today}. Wedding guests fly to Pisa (PSA) or Florence (FLR) in Italy, arriving May 19 2027 and departing May 24-25 2027.
For each origin (${ORIGINS.map((o) => o.label).join(", ")}), give the cheapest realistic round-trip option based on typical published fares and known airline routes for that season.
Known context: Aer Lingus flies nonstop IND-Dublin then on to Pisa; KLM/Delta via Amsterdam; Air France via Paris CDG and Lufthansa via Frankfurt from Chicago.
Respond with JSON only, shape:
{"fares":[{"origin":"IND","headline":"short label e.g. Aer Lingus via Dublin","routing":"IND → DUB → PSA","airline":"Aer Lingus","price_low":780,"price_high":1100,"note":"one short sentence of practical advice"}]}
Prices are USD round trip per person, estimates only.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a travel fare analyst. Reply with strict JSON only, no markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, errText);
      return new Response(JSON.stringify({ error: "AI request failed", status: aiRes.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const raw: string = aiJson?.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed: { fares?: Array<Record<string, unknown>> };
    try {
      parsed = JSON.parse(cleaned);
    } catch (_e) {
      console.error("Could not parse AI output:", raw.slice(0, 500));
      return new Response(JSON.stringify({ error: "Unparseable AI output" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = (parsed.fares ?? [])
      .filter((f) => f && typeof f.origin === "string")
      .slice(0, 4)
      .map((f) => ({
        checked_on: today,
        origin: String(f.origin),
        headline: String(f.headline ?? "Best available routing").slice(0, 160),
        routing: String(f.routing ?? "").slice(0, 200),
        airline: f.airline ? String(f.airline).slice(0, 120) : null,
        price_low: Number.isFinite(Number(f.price_low)) ? Math.round(Number(f.price_low)) : null,
        price_high: Number.isFinite(Number(f.price_high)) ? Math.round(Number(f.price_high)) : null,
        note: f.note ? String(f.note).slice(0, 500) : null,
      }));

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "No fares returned" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase.from("fare_watch").insert(rows);
    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, inserted: rows.length, checked_on: today }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("daily-fare-watch error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
