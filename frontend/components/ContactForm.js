"use client";

import { useState } from "react";
import { submitContact } from "@/services/contactService";
import { toast } from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitContact(formData);
      if (res.success) {
        toast.success(res.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory border border-border-cream rounded-[48px] p-8 md:p-16 shadow-whisper relative overflow-hidden">
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal-warm font-sans px-1">Your Name</label>
            <input 
              type="text" 
              required
              placeholder="Jane Doe"
              className="w-full bg-warm-sand/20 border border-border-cream rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all font-sans"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal-warm font-sans px-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="jane@example.com"
              className="w-full bg-warm-sand/20 border border-border-cream rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all font-sans"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal-warm font-sans px-1">Subject</label>
            <input 
              type="text" 
              required
              placeholder="How can we help?"
              className="w-full bg-warm-sand/20 border border-border-cream rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all font-sans"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-charcoal-warm font-sans px-1">Message</label>
          <textarea 
            required
            placeholder="Tell us a bit more about what's on your mind..."
            rows={5}
            className="w-full bg-warm-sand/20 border border-border-cream rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all font-sans resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-terracotta w-full py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50 group font-serif"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" /> Sending...
            </>
          ) : (
            <>
              Send Message <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </>
          )}
        </button>
        
        <p className="text-center text-xs text-stone-gray font-sans ">
          By submitting, you agree to our privacy policy.
        </p>
      </form>

      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl" />
    </div>
  );
}
