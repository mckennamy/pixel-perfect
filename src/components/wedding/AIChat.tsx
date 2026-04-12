import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2 } from "lucide-react";

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
      // Build conversation history
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // This calls the AI gateway. Connect Supabase or set VITE_AI_FUNCTION_URL.
      const aiUrl =
        import.meta.env.VITE_AI_FUNCTION_URL ||
        "https://your-project.supabase.co/functions/v1/wedding-ai";

      const res = await fetch(aiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemContext, messages: history }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      // Handle streaming or JSON response
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
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
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
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantText },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm not fully set up yet — connect the AI backend in Lovable to activate me! In the meantime, feel free to browse the curated resources on this page.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-parchment-d rounded-sm shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-moss-dark px-5 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-chartreuse/20 flex items-center justify-center">
          <Bot size={16} className="text-chartreuse" />
        </div>
        <div>
          <p className="font-kicker text-xs tracking-widest text-chartreuse uppercase">
            {title}
          </p>
          <p className="font-body text-xs text-white/60">{subtitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto p-4 flex flex-col gap-3 bg-parchment/30">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-4">
            <p className="font-body text-sm text-ink-light italic">
              Ask me anything — I'm here to help!
            </p>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs font-body border border-burg/30 text-burg px-3 py-1.5 rounded-sm hover:bg-burg hover:text-white transition-colors"
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
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 text-sm font-body leading-relaxed ${
                msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="chat-bubble-ai px-4 py-2.5 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-ink-light" />
              <span className="text-xs text-ink-light font-body italic">
                Thinking…
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-parchment-d p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder={placeholder}
          className="flex-1 text-sm font-body bg-parchment/50 border border-parchment-d rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burg/40 placeholder:text-ink-light/60"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-9 h-9 flex items-center justify-center bg-burg text-white rounded-sm hover:bg-burg-mid disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
