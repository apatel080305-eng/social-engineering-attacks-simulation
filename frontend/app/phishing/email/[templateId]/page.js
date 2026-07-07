"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTemplate, submitTemplate } from "@/services/phishingService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ChevronLeft, CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react";


function EmailBlock({ block }) {
  switch (block.type) {
    case "greeting":
      return <p className="text-sm text-near-black font-medium mb-3">{block.content}</p>;
    case "paragraph":
      return <p className="text-sm text-near-black leading-relaxed mb-3">{block.content}</p>;
    case "callout":
      return (
        <div className="bg-amber-50 border-l-4 border-amber-400 px-4 py-3 rounded-r-lg mb-3">
          <p className="text-sm text-amber-900 font-medium">{block.content}</p>
        </div>
      );
    case "button":
      return (
        <div className="my-4">
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium cursor-default select-none ${
            block.style === "danger" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
          }`}>
            {block.label}
          </div>
          <p className="text-xs text-stone-gray/60 font-mono mt-1.5 break-all">{block.href}</p>
        </div>
      );
    case "divider":
      return <hr className="border-border-cream my-4" />;
    case "list":
      return (
        <ul className="text-sm text-near-black space-y-1 mb-3 pl-1">
          {(block.items || []).map((item, i) => (
            <li key={i} className="flex gap-2"><span className="text-stone-gray shrink-0">•</span>{item}</li>
          ))}
        </ul>
      );
    case "footer":
      return <p className="text-xs text-stone-gray mt-4 pt-3 border-t border-border-cream">{block.content}</p>;
    case "signature":
      return <p className="text-sm text-near-black mt-3 whitespace-pre-line">{block.content}</p>;
    default:
      return null;
  }
}

export default function EmailTemplatePage() {
  const router = useRouter();
  const { templateId } = useParams();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("reading"); 
  const [selected, setSelected] = useState(new Set());
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getTemplate(templateId);
        setTemplate(res.data?.template);
      } catch {
        router.push("/phishing/email");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [templateId]);

  const toggleFlag = (flagId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(flagId) ? next.delete(flagId) : next.add(flagId);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await submitTemplate(templateId, { selected: Array.from(selected) });
      setResults(res.data);
      setPhase("results");
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    );
  }

  if (!template) return null;

  const { emailMeta, body, flags } = template;

  
  if (phase === "reading") {
    return (
      <div className="flex flex-col min-h-screen bg-parchment">
        <Header />
        <main className="grow py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => router.push("/phishing/email")} className="flex items-center gap-1.5 text-sm text-stone-gray hover:text-near-black mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Email Lab
            </button>

            <div className="mb-6">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-1">Email Lab</p>
              <h1 className="text-2xl font-serif text-near-black">{template.title}</h1>
              <p className="text-sm text-stone-gray mt-1">Read this email carefully, then identify the red flags.</p>
            </div>

            
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden mb-6">
              
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 font-mono ml-2">Mail - Inbox</span>
              </div>

              
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-900 mb-3 text-base">{emailMeta?.subject}</h2>
                <div className="space-y-1">
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-500 w-12 shrink-0">From:</span>
                    <span className="text-gray-800">{emailMeta?.fromName} <span className="text-gray-400 font-mono">&lt;{emailMeta?.fromAddress}&gt;</span></span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-500 w-12 shrink-0">To:</span>
                    <span className="text-gray-800 font-mono">{emailMeta?.toAddress}</span>
                  </div>
                  {emailMeta?.replyTo && (
                    <div className="flex gap-2 text-xs">
                      <span className="text-gray-500 w-12 shrink-0">Reply-To:</span>
                      <span className="text-gray-800 font-mono">{emailMeta.replyTo}</span>
                    </div>
                  )}
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-500 w-12 shrink-0">Date:</span>
                    <span className="text-gray-800">{emailMeta?.dateLabel}</span>
                  </div>
                </div>
              </div>

              
              <div className="px-6 py-5">
                {(body || []).map((block, i) => <EmailBlock key={i} block={block} />)}
              </div>
            </div>

            <button
              onClick={() => setPhase("flagging")}
              className="btn-terracotta w-full py-3 text-sm font-medium"
            >
              I have read this - identify red flags
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── FLAGGING phase ─────────────────────────────────────────────────────────
  if (phase === "flagging") {
    return (
      <div className="flex flex-col min-h-screen bg-parchment">
        <Header />
        <main className="grow py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setPhase("reading")} className="flex items-center gap-1.5 text-sm text-stone-gray hover:text-near-black mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Re-read email
            </button>

            <div className="mb-6">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-1">Flag Selection</p>
              <h1 className="text-2xl font-serif text-near-black mb-2">What looks suspicious?</h1>
              <p className="text-sm text-stone-gray">Select every red flag you spotted in this email. You will be penalised for selecting things that are not actually suspicious.</p>
            </div>

            <div className="space-y-3 mb-8">
              {(flags || []).map((flag) => {
                const isSelected = selected.has(flag.flagId);
                return (
                  <button
                    key={flag.flagId}
                    onClick={() => toggleFlag(flag.flagId)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "border-terracotta bg-terracotta/5 text-near-black"
                        : "border-border-cream bg-ivory text-stone-gray hover:border-terracotta/30 hover:text-near-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                        isSelected ? "border-terracotta bg-terracotta" : "border-stone-gray/40"
                      }`}>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-sm font-medium">{flag.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={selected.size === 0 || submitting}
              className="btn-terracotta w-full py-3 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Submit ${selected.size} flag${selected.size !== 1 ? "s" : ""}`}
            </button>
            {selected.size === 0 && (
              <p className="text-center text-xs text-stone-gray mt-2">Select at least one red flag to submit.</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── RESULTS phase ──────────────────────────────────────────────────────────
  const { score, passed, found, missed, falsePositives, flagResults, allDefs } = results || {};
  const defMap = {};
  (allDefs || []).forEach((d) => { defMap[d.flagId] = d; });

  const caught      = (flagResults || []).filter((r) => r.gotRight);
  const missedFlags = (flagResults || []).filter((r) => r.wasPresent && !r.selected);
  const falseAlarms = (flagResults || []).filter((r) => !r.wasPresent && r.selected);

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="grow py-10 px-6">
        <div className="max-w-2xl mx-auto">
          
          <div className={`rounded-3xl p-8 mb-8 ${passed ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"}`}>
            <div className="flex items-center gap-5">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-serif font-bold shrink-0 ${
                passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {score}%
              </div>
              <div>
                <p className={`text-lg font-serif font-semibold ${passed ? "text-green-800" : "text-amber-800"}`}>
                  {passed ? "Good catch!" : "Keep practising"}
                </p>
                <p className="text-sm text-stone-gray mt-1">
                  Found {found} of {found + missed} red flags · {falsePositives} false alarm{falsePositives !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          
          {caught.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-mono text-green-600 uppercase tracking-widest mb-3">Correctly Identified</p>
              <div className="space-y-3">
                {caught.map((r) => {
                  const def = defMap[r.flagId];
                  return (
                    <div key={r.flagId} className="bg-green-50 border border-green-100 rounded-2xl p-4">
                      <div className="flex gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-green-900">{def?.label}</p>
                      </div>
                      <p className="text-xs text-green-700 ml-6">{def?.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          
          {missedFlags.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-mono text-red-500 uppercase tracking-widest mb-3">Missed Red Flags</p>
              <div className="space-y-3">
                {missedFlags.map((r) => {
                  const def = defMap[r.flagId];
                  return (
                    <div key={r.flagId} className="bg-red-50 border border-red-100 rounded-2xl p-4">
                      <div className="flex gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-red-900">{def?.label}</p>
                      </div>
                      <p className="text-xs text-red-700 ml-6">{def?.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          
          {falseAlarms.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-mono text-amber-600 uppercase tracking-widest mb-3">False Alarms</p>
              <div className="space-y-3">
                {falseAlarms.map((r) => {
                  const def = defMap[r.flagId];
                  return (
                    <div key={r.flagId} className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                      <div className="flex gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-amber-900">{def?.label}</p>
                      </div>
                      <p className="text-xs text-amber-700 ml-6">{def?.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setPhase("reading"); setSelected(new Set()); setResults(null); }}
              className="flex-1 py-3 rounded-2xl border border-border-cream text-stone-gray hover:text-near-black text-sm transition-colors"
            >
              Try Again
            </button>
            <button onClick={() => router.push("/phishing/email")} className="flex-1 btn-terracotta py-3 text-sm">
              Next Email
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
