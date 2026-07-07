"use client";

import Link from "next/link";
import UserLayoutWrapper from "@/components/UserLayoutWrapper";
import { Mail, Monitor, ChevronRight, ShieldAlert } from "lucide-react";

export default function PhishingHubPage() {
  return (
    <UserLayoutWrapper>
      <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-2">Interactive Labs</p>
            <h1 className="text-4xl font-serif text-near-black mb-3">Spot the Fake</h1>
            <p className="text-stone-gray max-w-lg">
              Practice identifying real-world phishing attacks. Study fake emails and login pages to learn exactly what to look for before it counts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/phishing/email"
              className="bg-ivory border border-border-cream rounded-3xl p-8 shadow-whisper hover:border-terracotta/40 transition-all group flex flex-col gap-4"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-7 h-7 text-red-500" />
              </div>
              <div className="grow">
                <h2 className="font-serif text-2xl text-near-black mb-2">Fake Email Lab</h2>
                <p className="text-stone-gray text-sm leading-relaxed mb-4">
                  Read 12 realistic phishing emails and identify the red flags - wrong sender domains, urgency tactics, suspicious links, grammar mistakes, and more.
                </p>
                <ul className="space-y-1.5">
                  {["Wrong sender domains", "Urgency and fear tactics", "Typosquatted links", "BEC and invoice fraud"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-stone-gray">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 text-terracotta font-medium text-sm group-hover:gap-3 transition-all">
                Start Email Lab <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/phishing/login"
              className="bg-ivory border border-border-cream rounded-3xl p-8 shadow-whisper hover:border-terracotta/40 transition-all group flex flex-col gap-4"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Monitor className="w-7 h-7 text-blue-500" />
              </div>
              <div className="grow">
                <h2 className="font-serif text-2xl text-near-black mb-2">Fake Login Lab</h2>
                <p className="text-stone-gray text-sm leading-relaxed mb-4">
                  Examine 5 fake login pages for Microsoft, Google, PayPal, a bank, and Facebook. Find the subtle clues that reveal each page is a fraud.
                </p>
                <ul className="space-y-1.5">
                  {["Typosquatted URLs", "Incorrect logos and colours", "Extra form fields", "Missing security indicators"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-stone-gray">
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-400 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 text-terracotta font-medium text-sm group-hover:gap-3 transition-all">
                Start Login Lab <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
      </div>
    </UserLayoutWrapper>
  );
}
