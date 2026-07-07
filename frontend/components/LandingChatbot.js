"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, ChevronDown } from "lucide-react";

const WELCOME = "Hello! Ask me anything about INTERCEPTOR - how it works, what you can learn, or how to get started.";

const FALLBACKS = [
  "That's a great question! INTERCEPTOR covers a lot of ground - from phishing simulations to MFA fatigue attacks. Could you rephrase or ask about a specific feature?",
  "I want to make sure I give you the right answer. Could you ask about a specific part of INTERCEPTOR - like simulations, learning modules, pricing, or getting started?",
  "Hmm, I'm not quite sure I caught that. Feel free to ask about how INTERCEPTOR works, what scenarios we offer, or how to create a free account.",
  "Good question - let me point you in the right direction. Try asking about our simulations, the Phishing Lab, your security score, or how to sign up.",
];

let _fallbackIdx = 0;
function getFallback() {
  return FALLBACKS[_fallbackIdx++ % FALLBACKS.length];
}

export default function LandingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "", streaming: true },
    ]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) throw new Error("api error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          try {
            const ev = JSON.parse(part.slice(6));
            if (ev.type === "token") {
              accumulated += ev.token;
              setMessages((prev) => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = { role: "assistant", content: accumulated, streaming: true };
                return msgs;
              });
            } else if (ev.type === "done") {
              setMessages((prev) => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = { role: "assistant", content: accumulated };
                return msgs;
              });
            } else if (ev.type === "error") {
              throw new Error("stream error");
            }
          } catch {}
        }
      }

      // If stream ended but nothing was received, show a fallback
      if (!accumulated) throw new Error("empty response");

    } catch {
      setMessages((prev) => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = { role: "assistant", content: getFallback() };
        return msgs;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {open && (
        <div className="w-[360px] bg-ivory border border-border-cream rounded-[28px] shadow-[0_8px_48px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">
          
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-cream bg-warm-sand/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-terracotta" />
              </div>
              <div>
                <p className="text-sm font-semibold text-near-black font-sans leading-none">
                  Ask anything
                </p>
                <p className="text-xs text-stone-gray font-sans mt-0.5">About INTERCEPTOR</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-warm-sand transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-stone-gray" />
            </button>
          </div>

          
          <div className="overflow-y-auto px-4 py-4 space-y-3 max-h-80 min-h-[12rem]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed font-sans ${
                    msg.role === "user"
                      ? "bg-terracotta text-ivory rounded-br-sm"
                      : "bg-warm-sand/70 text-charcoal-warm rounded-bl-sm"
                  }`}
                >
                  {msg.content || (msg.streaming ? "" : "…")}
                  {msg.streaming && (
                    <span className="inline-block ml-0.5 w-0.5 h-3.5 bg-stone-gray/60 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          
          <div className="px-4 py-3 border-t border-border-cream bg-parchment/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                className="flex-1 bg-ivory border border-border-warm rounded-xl px-4 py-2.5 text-sm font-sans text-near-black placeholder:text-stone-gray/60 focus:outline-none focus:ring-2 focus:ring-terracotta/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-terracotta text-ivory rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-[#b05739] transition-colors"
                aria-label="Send"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 bg-terracotta text-ivory rounded-full shadow-[0_4px_24px_rgba(201,100,66,0.45)] flex items-center justify-center hover:bg-[#b05739] transition-all hover:scale-105 active:scale-95"
        aria-label="Open chat"
      >
        {open ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
