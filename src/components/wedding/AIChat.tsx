import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  title: string;
  subtitle: string;
  systemContext: string;
  placeholder?: string;
  suggestions?: string[];
}

export default function AIChat({
  title,
  subtitle,
  systemContext,
  placeholder = "Ask me anything…",
  suggestions = [],
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMessage: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const aiUrl = `${supabaseUrl}/functions/v1/wedding-ai`;

      const res = await fetch(aiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({ systemContext, messages: history }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const contentType = res.headers.get("content-type") || "";
      let assistantText = "";

      if (contentType.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              assistantText += delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantText };
                return updated;
              });
            } catch {
              // skip malformed chunk
            }
          }
        }
      } else {
        const data = await res.json();
        assistantText =
          data.choices?.[0]?.message?.content ||
          data.message ||
          "I'm sorry, I couldn't generate a response.";
        setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment, or browse the resources on this page in the meantime.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--cream))", overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          background: "hsl(var(--moss))",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Icon — simple monogram circle */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(138,158,20,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              color: "hsl(var(--chart-mid))",
            }}
          >
            AI
          </span>
        </div>
        <div>
          <p
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.52rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "hsl(var(--chart-mid))",
              lineHeight: 1.3,
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontFamily: "EB Garamond, serif",
              fontStyle: "italic",
              fontSize: "0.78rem",
              color: "rgba(250,248,242,0.45)",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          height: 288,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          background: "hsl(var(--parchment))",
        }}
      >
        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", textAlign: "center", padding: "1rem 0" }}>
            <p style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: "0.875rem", color: "hsl(var(--stone))" }}>
              Ask me anything — I'm here to help.
            </p>
            {suggestions.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.5rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      border: "1px solid hsl(var(--burg) / 0.3)",
                      color: "hsl(var(--burg))",
                      padding: "0.4rem 0.8rem",
                      background: "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--burg))";
                      (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--cream))";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--burg))";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              className={msg.role === "user" ? "chat-user" : "chat-ai"}
              style={{
                maxWidth: "80%",
                padding: "0.6rem 1rem",
                fontSize: "0.875rem",
                fontFamily: "EB Garamond, serif",
                lineHeight: 1.6,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              className="chat-ai"
              style={{ padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontStyle: "italic",
                  fontSize: "0.8rem",
                  color: "hsl(var(--stone))",
                  animation: "pulse 1.4s ease-in-out infinite",
                }}
              >
                Thinking…
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: "1px solid hsl(var(--border))",
          padding: "0.75rem",
          display: "flex",
          gap: "0.5rem",
          background: "hsl(var(--cream))",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder={placeholder}
          style={{
            flex: 1,
            fontFamily: "EB Garamond, serif",
            fontSize: "0.875rem",
            background: "hsl(var(--parchment))",
            border: "1px solid hsl(var(--border))",
            padding: "0.5rem 0.75rem",
            outline: "none",
            color: "hsl(var(--ink))",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "hsl(var(--burg-mid))")}
          onBlur={e => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            width: 38,
            height: 38,
            flexShrink: 0,
            background: "hsl(var(--burg))",
            color: "hsl(var(--cream))",
            border: "none",
            cursor: !input.trim() || loading ? "not-allowed" : "pointer",
            opacity: !input.trim() || loading ? 0.4 : 1,
            transition: "opacity 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Cinzel, serif",
            fontSize: "0.7rem",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
