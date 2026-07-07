"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTemplate, submitTemplate } from "@/services/phishingService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ChevronLeft, CheckCircle, XCircle, AlertTriangle, Lock, Globe } from "lucide-react";


function MicrosoftFakePage() {
  return (
    <div className="bg-white min-h-72 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <p className="text-gray-400 text-2xl font-light mb-6 tracking-wide">Microsoft</p>
        <h2 className="text-xl text-gray-800 font-medium mb-6">Sign in</h2>
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Email, phone, or Skype" />
        <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Password" />
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none" placeholder="Date of birth (DD/MM/YYYY)" />
        <button className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium">Sign in</button>
        <p className="text-xs text-gray-500 mt-4 text-center">By signing in you agree to our <span className="text-blue-600">Terms</span></p>
      </div>
    </div>
  );
}

function GoogleFakePage() {
  return (
    <div className="bg-white min-h-72 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm text-center">
        <p className="text-4xl font-bold mb-2">
          <span className="text-blue-500">G</span>
          <span className="text-red-400">o</span>
          <span className="text-yellow-400">o</span>
          <span className="text-blue-400">g</span>
          <span className="text-green-400">l</span>
          <span className="text-red-500">e</span>
        </p>
        <p className="text-gray-600 text-sm mb-5">Sign in to continue</p>
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Email or phone" />
        <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none" placeholder="Password" />
        <button className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium">Next</button>
        <p className="text-xs text-gray-400 mt-4">
          <span className="text-blue-500 cursor-pointer">Privacy Policy</span> · <span className="text-blue-500 cursor-pointer">Terms of Service</span>
        </p>
        <p className="text-xs text-gray-300 mt-1">(links go to google-policy.net)</p>
      </div>
    </div>
  );
}

function PayPalFakePage() {
  return (
    <div className="bg-white min-h-72 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl font-bold text-blue-900">Pay</span>
          <span className="text-2xl font-bold text-blue-400">Pal</span>
          <span className="ml-2 text-xs bg-gray-100 border border-gray-300 px-2 py-0.5 rounded text-gray-600 shadow-sm">VeriSign Secured™</span>
        </div>
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Email address" />
        <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Password" />
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none" placeholder="Date of birth" />
        <button className="w-full bg-blue-700 text-white py-2 rounded text-sm font-medium">Log In</button>
      </div>
    </div>
  );
}

function BankFakePage() {
  return (
    <div className="bg-white min-h-72 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="text-lg font-semibold text-green-900">Lloyds Bank</span>
        </div>
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="User ID" />
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Memorable word (full)" />
        <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Mobile number" />
        <button className="w-full bg-green-800 text-white py-2 rounded text-sm font-medium">Log on</button>
        <p className="text-xs text-gray-400 mt-3 text-center">lloydsbanking-secure.com</p>
      </div>
    </div>
  );
}

function FacebookFakePage() {
  return (
    <div className="bg-gray-100 min-h-72 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <p className="text-4xl font-bold text-blue-600 mb-4 lowercase tracking-tight">facebook</p>
        <div className="bg-white rounded-lg p-5 shadow">
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Email address or phone number" />
          <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none" placeholder="Password" />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">Log in</button>
          <p className="text-center text-xs text-gray-400 mt-3">Forgotten password?</p>
          <hr className="my-3" />
          <button className="w-full border border-green-600 text-green-600 py-2 rounded-lg text-sm font-semibold">Create new account</button>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">facebook.com.account-login-secure.net - Page contains speling erors in footer</p>
      </div>
    </div>
  );
}

const FAKE_PAGES = {
  login_001: MicrosoftFakePage,
  login_002: GoogleFakePage,
  login_003: PayPalFakePage,
  login_004: BankFakePage,
  login_005: FacebookFakePage,
};

export default function LoginTemplatePage() {
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
        router.push("/phishing/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [templateId]);

  const toggleMistake = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
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

  const { loginMeta, mistakes } = template;
  const FakePage = FAKE_PAGES[templateId];

  
  if (phase === "reading") {
    return (
      <div className="flex flex-col min-h-screen bg-parchment">
        <Header />
        <main className="grow py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => router.push("/phishing/login")} className="flex items-center gap-1.5 text-sm text-stone-gray hover:text-near-black mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Login Lab
            </button>

            <div className="mb-6">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-1">Login Lab</p>
              <h1 className="text-2xl font-serif text-near-black">{template.title}</h1>
              <p className="text-sm text-stone-gray mt-1">Study this page carefully. Something is not right.</p>
            </div>

            
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden mb-6">
              
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  
                  <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-gray-300 mx-2">
                    <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs font-mono text-gray-700 truncate">{loginMeta?.pageUrl}</span>
                  </div>
                </div>
              </div>

              
              {FakePage ? <FakePage /> : (
                <div className="p-8 text-center text-stone-gray text-sm">Login page preview not available.</div>
              )}
            </div>

            <button onClick={() => setPhase("flagging")} className="btn-terracotta w-full py-3 text-sm font-medium">
              I have examined this page - identify the mistakes
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
              <ChevronLeft className="w-4 h-4" /> Re-examine page
            </button>

            <div className="mb-6">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-1">Mistake Selection</p>
              <h1 className="text-2xl font-serif text-near-black mb-2">What gave it away?</h1>
              <p className="text-sm text-stone-gray">Select every mistake you spotted on this fake login page.</p>
            </div>

            <div className="space-y-3 mb-8">
              {(mistakes || []).map((m) => {
                const isSelected = selected.has(m.mistakeId);
                return (
                  <button
                    key={m.mistakeId}
                    onClick={() => toggleMistake(m.mistakeId)}
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
                      <div>
                        <p className="text-sm font-medium">{m.label}</p>
                        {m.targetHint && (
                          <p className="text-xs text-stone-gray/60 mt-0.5 capitalize">{m.targetHint.replace("_", " ")}</p>
                        )}
                      </div>
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
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Submit ${selected.size} mistake${selected.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── RESULTS phase ──────────────────────────────────────────────────────────
  const { score, passed, found, missed, falsePositives, flagResults, allDefs } = results || {};
  const defMap = {};
  (allDefs || []).forEach((d) => { defMap[d.mistakeId] = d; });

  const caught      = (flagResults || []).filter((r) => r.gotRight);
  const missedItems = (flagResults || []).filter((r) => r.wasPresent && !r.selected);
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
                  {passed ? "Sharp eye!" : "Keep practising"}
                </p>
                <p className="text-sm text-stone-gray mt-1">
                  Found {found} of {found + missed} mistakes · {falsePositives} false alarm{falsePositives !== 1 ? "s" : ""}
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
                      <div className="flex gap-2 mb-1"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><p className="text-sm font-medium text-green-900">{def?.label}</p></div>
                      <p className="text-xs text-green-700 ml-6">{def?.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {missedItems.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-mono text-red-500 uppercase tracking-widest mb-3">Missed Mistakes</p>
              <div className="space-y-3">
                {missedItems.map((r) => {
                  const def = defMap[r.flagId];
                  return (
                    <div key={r.flagId} className="bg-red-50 border border-red-100 rounded-2xl p-4">
                      <div className="flex gap-2 mb-1"><XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><p className="text-sm font-medium text-red-900">{def?.label}</p></div>
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
                      <div className="flex gap-2 mb-1"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /><p className="text-sm font-medium text-amber-900">{def?.label}</p></div>
                      <p className="text-xs text-amber-700 ml-6">{def?.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => { setPhase("reading"); setSelected(new Set()); setResults(null); }} className="flex-1 py-3 rounded-2xl border border-border-cream text-stone-gray hover:text-near-black text-sm transition-colors">
              Try Again
            </button>
            <button onClick={() => router.push("/phishing/login")} className="flex-1 btn-terracotta py-3 text-sm">
              Next Page
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
