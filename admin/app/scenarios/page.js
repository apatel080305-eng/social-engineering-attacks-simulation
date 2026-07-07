"use client";

import { useEffect, useState } from "react";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import {
  getAllScenarios, seedScenarios, createScenario, updateScenario, deleteScenario,
} from "@/services/analyticsService";
import { Loader2, Plus, Pencil, Trash2, CheckCircle, Database } from "lucide-react";

const TYPES = ["phishing_email", "vishing", "bec", "mfa_fatigue", "pretexting"];
const DIFFS = ["easy", "medium", "hard"];

const DIFF_COLORS = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100 text-red-700",
};

const EMPTY_FORM = {
  scenarioId: "", name: "", type: "phishing_email", difficulty: "medium",
  attackerPersona: "", description: "", triggers: [],
};

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const [modal, setModal] = useState(null); 
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchScenarios(); }, []);

  const fetchScenarios = async () => {
    try {
      const res = await getAllScenarios();
      setScenarios(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await seedScenarios();
      setSeedMsg(res.message);
      await fetchScenarios();
    } catch { setSeedMsg("Seed failed."); }
    finally { setSeeding(false); }
  };

  const openCreate = () => { setForm(EMPTY_FORM); setModal("create"); };
  const openEdit = (s) => {
    setForm({
      scenarioId: s.scenarioId, name: s.name, type: s.type, difficulty: s.difficulty,
      attackerPersona: s.attackerPersona, description: s.description,
      triggers: s.triggers || [],
    });
    setModal({ type: "edit", id: s._id });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === "create") {
        await createScenario(form);
      } else {
        await updateScenario(modal.id, form);
      }
      await fetchScenarios();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Deactivate this scenario?")) return;
    await deleteScenario(id);
    await fetchScenarios();
  };

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleTrigger = (t) => {
    setForm((f) => ({
      ...f,
      triggers: f.triggers.includes(t) ? f.triggers.filter((x) => x !== t) : [...f.triggers, t],
    }));
  };

  const ALL_TRIGGERS = ["urgency", "authority", "fear", "curiosity", "helpfulness", "trust", "secrecy", "social_proof", "scarcity", "annoyance_exploitation"];

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayoutWrapper>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Administration</p>
          <h1 className="text-3xl font-serif text-near-black">Scenario Management</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="btn-warm-sand px-5 py-2.5 text-sm flex items-center gap-2"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Seed Defaults
          </button>
          <button onClick={openCreate} className="btn-terracotta px-5 py-2.5 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Scenario
          </button>
        </div>
      </div>

      {seedMsg && (
        <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 text-sm text-green-700">
          <CheckCircle className="w-4 h-4" /> {seedMsg}
        </div>
      )}

      <div className="bg-ivory border border-border-cream rounded-3xl shadow-whisper overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-cream bg-parchment/50">
              <th className="text-left px-6 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Type</th>
              <th className="text-center px-4 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Difficulty</th>
              <th className="text-left px-4 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Persona</th>
              <th className="text-center px-4 py-3 font-mono text-xs text-stone-gray uppercase tracking-wider">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr key={s._id} className="border-b border-border-cream/50 hover:bg-warm-sand/10">
                <td className="px-6 py-4 font-medium text-near-black">{s.name}</td>
                <td className="px-5 py-4 text-stone-gray text-xs font-mono">{s.type.replace(/_/g, " ")}</td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${DIFF_COLORS[s.difficulty]}`}>
                    {s.difficulty}
                  </span>
                </td>
                <td className="px-4 py-4 text-stone-gray text-xs">{s.attackerPersona}</td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${s.isActive ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-warm-sand/40 text-stone-gray hover:text-near-black transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-gray hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {scenarios.length === 0 && (
          <div className="text-center py-16 text-stone-gray">
            <p>No scenarios found. Click "Seed Defaults" to add the built-in scenarios.</p>
          </div>
        )}
      </div>

      
      {modal && (
        <div className="fixed inset-0 bg-near-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-ivory rounded-3xl p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl text-near-black mb-6">{modal === "create" ? "New Scenario" : "Edit Scenario"}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-stone-gray mb-1.5 uppercase">Scenario ID</label>
                  <input value={form.scenarioId} onChange={(e) => setField("scenarioId", e.target.value)} className="input-field w-full" placeholder="phish_006" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-stone-gray mb-1.5 uppercase">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setField("difficulty", e.target.value)} className="input-field w-full">
                    {DIFFS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-stone-gray mb-1.5 uppercase">Name</label>
                <input value={form.name} onChange={(e) => setField("name", e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-xs font-mono text-stone-gray mb-1.5 uppercase">Type</label>
                <select value={form.type} onChange={(e) => setField("type", e.target.value)} className="input-field w-full">
                  {TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-stone-gray mb-1.5 uppercase">Attacker Persona</label>
                <input value={form.attackerPersona} onChange={(e) => setField("attackerPersona", e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-xs font-mono text-stone-gray mb-1.5 uppercase">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setField("description", e.target.value)} className="input-field w-full resize-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-stone-gray mb-2 uppercase">Psychological Triggers</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TRIGGERS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTrigger(t)}
                      className={`px-3 py-1 rounded-full text-xs font-mono border transition-all capitalize ${
                        form.triggers.includes(t)
                          ? "bg-terracotta text-ivory border-terracotta"
                          : "bg-warm-sand/40 text-stone-gray border-border-cream hover:border-terracotta/30"
                      }`}
                    >
                      {t.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={handleSave} disabled={saving} className="btn-terracotta flex-1 py-2.5 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Scenario"}
              </button>
              <button onClick={() => setModal(null)} className="btn-warm-sand flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
