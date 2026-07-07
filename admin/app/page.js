"use client";

import Link from "next/link";
import { ArrowRight, Lock, Layout, Shield } from "lucide-react";

export default function AdminLandingPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col p-6 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-terracotta/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />
      </div>

      <nav className="max-w-7xl w-full mx-auto py-8 flex justify-between items-center relative z-10">
        <Link href="/" className="text-2xl font-serif font-semibold text-near-black tracking-tight">
          INTERCEPTOR <span className="text-terracotta  ml-1">Admin</span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-near-black hover:text-terracotta transition-colors">
          Internal Login &rarr;
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center relative z-10 py-20 px-6 md:px-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <div className="text-center lg:text-left">
            <header className="mb-12">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-4">Internal Portal</p>
              <h1 className="text-5xl md:text-8xl font-serif text-near-black mb-8 leading-tight">
                Manage the <span className=" text-terracotta">safety</span>.
              </h1>
              <p className="text-xl md:text-2xl text-olive-gray font-sans max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The centralized space for the INTERCEPTOR team. Organize practice modules, help our community, and keep the platform running smoothly.
              </p>
            </header>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link href="/login" className="btn-terracotta text-lg px-12 py-5 group shadow-whisper">
                Login to Portal <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="btn-warm-sand text-lg px-12 py-5 shadow-whisper border border-border-cream">
                Check Status
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-terracotta/5 rounded-[64px] blur-2xl group-hover:bg-terracotta/10 transition-all duration-700" />
            <div className="relative bg-ivory border border-border-cream p-12 lg:p-20 rounded-[64px] shadow-whisper overflow-hidden">
              <img 
                src="/admin-illustration.png" 
                alt="Admin Dashboard Illustration" 
                className="w-full h-auto drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-t border-border-cream/50 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-terracotta shadow-whisper border border-border-cream/50">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-near-black mb-1">Secure Sign-in</h3>
            <p className="text-sm text-olive-gray">Private access for our dedicated team members only.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-terracotta shadow-whisper border border-border-cream/50">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-near-black mb-1">Simple Interface</h3>
            <p className="text-sm text-olive-gray">Tools designed for clarity and ease of management.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-terracotta shadow-whisper border border-border-cream/50">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-near-black mb-1">Platform Safety</h3>
            <p className="text-sm text-olive-gray">Monitoring the community to ensure a safe environment.</p>
          </div>
        </div>
      </div>

      <footer className="py-12 text-center text-stone-gray text-xs font-mono tracking-widest uppercase opacity-40">
        INTERCEPTOR Internal &middot; Secure Team Environment
      </footer>
    </div>
  );
}
