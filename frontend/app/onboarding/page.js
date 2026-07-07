"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSecurityProfile } from "@/services/userService";
import { Loader2, ChevronRight, Shield, User, Briefcase, Settings, CheckCircle } from "lucide-react";

const STEPS = [
  { id: 1, title: "Your Role",        icon: User      },
  { id: 2, title: "Your Organisation", icon: Briefcase },
  { id: 3, title: "Your Experience",   icon: Settings  },
  { id: 4, title: "Your Risk Profile", icon: Shield    },
];

const JOB_ROLES = [
  { value: "executive",   label: "Executive / C-Suite",        desc: "CEO, CFO, COO, Director" },
  { value: "finance",     label: "Finance / Accounting",       desc: "Finance, payroll, AP/AR" },
  { value: "it",          label: "IT / Technology",            desc: "IT support, sysadmin, engineering" },
  { value: "hr",          label: "Human Resources",            desc: "HR, recruitment, people ops" },
  { value: "operations",  label: "Operations / Admin",         desc: "Operations, admin, facilities" },
  { value: "sales",       label: "Sales / Customer-facing",    desc: "Sales, account management, support" },
  { value: "legal",       label: "Legal / Compliance",         desc: "Legal, compliance, risk" },
  { value: "other",       label: "Other",                      desc: "Not listed above" },
];

const ORG_SIZES = [
  { value: "1-50",   label: "1–50 employees",    desc: "Small organisation" },
  { value: "51-200", label: "51–200 employees",  desc: "Medium organisation" },
  { value: "201-1000",label:"201–1,000 employees",desc: "Large organisation" },
  { value: "1000+",  label: "1,000+ employees",  desc: "Enterprise" },
];

const TECH_LEVELS = [
  { value: "beginner",     label: "Beginner",     desc: "I use computers for everyday tasks" },
  { value: "intermediate", label: "Intermediate", desc: "I am comfortable with technology" },
  { value: "advanced",     label: "Advanced",     desc: "I work in or closely with IT/technology" },
];

function OptionCard({ value, label, desc, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${
        selected
          ? "border-terracotta bg-terracotta/5 shadow-sm"
          : "border-border-cream bg-ivory hover:border-terracotta/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`font-medium text-sm ${selected ? "text-near-black" : "text-stone-gray"}`}>{label}</p>
          {desc && <p className="text-xs text-stone-gray/70 mt-0.5">{desc}</p>}
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-terracotta shrink-0" />}
      </div>
    </button>
  );
}

function ToggleCard({ label, desc, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
        checked
          ? "border-terracotta bg-terracotta/5"
          : "border-border-cream bg-ivory hover:border-terracotta/20"
      }`}
    >
      <div>
        <p className="font-medium text-sm text-near-black">{label}</p>
        {desc && <p className="text-xs text-stone-gray/70 mt-0.5">{desc}</p>}
      </div>
      <div className={`w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-terracotta" : "bg-border-cream"}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm mt-0.5 transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
      </div>
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    jobRole: "",
    department: "",
    orgSize: "",
    techLevel: "",
    priorTraining: false,
    handlesPayments: false,
    handlesPersonalData: false,
    usesRemoteAccess: false,
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const canAdvance = () => {
    if (step === 1) return !!form.jobRole;
    if (step === 2) return !!form.orgSize;
    if (step === 3) return !!form.techLevel;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await saveSecurityProfile(form);
      router.push("/dashboard");
    } catch {
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const stepData = STEPS[step - 1];
  const StepIcon = stepData.icon;

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">

        
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-terracotta/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-terracotta" />
          </div>
          <h1 className="text-3xl font-serif text-near-black mb-2">Build Your Security Profile</h1>
          <p className="text-stone-gray text-sm max-w-sm mx-auto">
            Your answers personalise your training and help us focus on the threats most relevant to your role.
          </p>
        </div>

        
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s) => (
            <div key={s.id} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s.id < step ? "bg-terracotta text-ivory" :
                s.id === step ? "bg-near-black text-ivory" :
                "bg-border-cream text-stone-gray"
              }`}>
                {s.id < step ? <CheckCircle className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-[10px] font-mono hidden sm:block ${s.id === step ? "text-near-black" : "text-stone-gray/60"}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        
        <div className="bg-ivory border border-border-cream rounded-3xl p-8 shadow-whisper mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-terracotta/10 rounded-xl flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-terracotta" />
            </div>
            <h2 className="font-serif text-xl text-near-black">{stepData.title}</h2>
          </div>

          
          {step === 1 && (
            <div className="space-y-2">
              <p className="text-sm text-stone-gray mb-4">What best describes your role at work?</p>
              {JOB_ROLES.map((r) => (
                <OptionCard key={r.value} {...r} selected={form.jobRole === r.value} onClick={(v) => set("jobRole", v)} />
              ))}
              <div className="mt-4">
                <label className="text-xs font-mono text-stone-gray uppercase tracking-widest block mb-2">Department (optional)</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  placeholder="e.g. Finance, Engineering, HR..."
                  className="w-full rounded-2xl border border-border-cream bg-parchment/50 px-4 py-3 text-sm text-near-black placeholder:text-stone-gray/50 focus:outline-none focus:border-terracotta/40"
                />
              </div>
            </div>
          )}

          
          {step === 2 && (
            <div className="space-y-2">
              <p className="text-sm text-stone-gray mb-4">How large is your organisation?</p>
              {ORG_SIZES.map((o) => (
                <OptionCard key={o.value} {...o} selected={form.orgSize === o.value} onClick={(v) => set("orgSize", v)} />
              ))}
            </div>
          )}

          
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-gray mb-3">How would you rate your technical security knowledge?</p>
                <div className="space-y-2">
                  {TECH_LEVELS.map((t) => (
                    <OptionCard key={t.value} {...t} selected={form.techLevel === t.value} onClick={(v) => set("techLevel", v)} />
                  ))}
                </div>
              </div>
              <ToggleCard
                label="I have received security awareness training before"
                desc="Security awareness courses, phishing simulations, etc."
                checked={form.priorTraining}
                onChange={(v) => set("priorTraining", v)}
              />
            </div>
          )}

          
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-stone-gray mb-4">
                Tell us about your work responsibilities. This helps us prioritise the most relevant attack scenarios for you.
              </p>
              <ToggleCard
                label="I handle payments or financial transfers"
                desc="Authorising or processing payments, wire transfers, invoices"
                checked={form.handlesPayments}
                onChange={(v) => set("handlesPayments", v)}
              />
              <ToggleCard
                label="I handle sensitive personal data"
                desc="Customer records, HR data, health information"
                checked={form.handlesPersonalData}
                onChange={(v) => set("handlesPersonalData", v)}
              />
              <ToggleCard
                label="I use remote access tools (VPN, RDP, etc.)"
                desc="Connecting to work systems from outside the office"
                checked={form.usesRemoteAccess}
                onChange={(v) => set("usesRemoteAccess", v)}
              />

              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                <p className="text-xs text-amber-700 font-medium">
                  Your profile is used only to personalise your training content. It is not shared externally.
                </p>
              </div>
            </div>
          )}
        </div>

        
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-3 rounded-2xl border border-border-cream text-stone-gray hover:text-near-black text-sm transition-colors"
            >
              Back
            </button>
          )}
          <div className="flex-1">
            {step < STEPS.length ? (
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="btn-terracotta w-full py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-40"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn-terracotta w-full py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-40"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Complete Profile <ChevronRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-3 py-2 text-xs text-stone-gray/60 hover:text-stone-gray transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
