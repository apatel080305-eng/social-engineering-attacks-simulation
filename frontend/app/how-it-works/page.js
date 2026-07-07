import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Flag, BookOpen, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "How It Works | INTERCEPTOR",
  description: "Discover the step-by-step process of our interactive social engineering simulations.",
};

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow pt-32 pb-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-40 text-center max-w-3xl mx-auto">
            <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-4 ">The Process</p>
            <h1 className="text-5xl md:text-8xl font-serif text-near-black leading-tight mb-8">
              Interactive <br />
              <span className=" text-terracotta">Defense</span>.
            </h1>
            <p className="text-xl text-olive-gray font-sans leading-relaxed">
              We've designed a four-step learning loop that transforms passive observation into active intelligence.
            </p>
          </header>

          <div className="space-y-60">
            
            
            <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">
              <div className="absolute -left-20 top-0 text-[20rem] font-serif text-terracotta/5 select-none pointer-events-none hidden lg:block">01</div>
              <div className="flex-1 order-2 lg:order-1">
                <div className="w-16 h-16 rounded-3xl bg-terracotta/10 flex items-center justify-center mb-8">
                  <Search className="w-8 h-8 text-terracotta" />
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-near-black mb-8 leading-tight">
                  The <span className="">Analysis</span> Phase.
                </h2>
                <p className="text-xl text-olive-gray font-sans leading-relaxed mb-10">
                  When you receive a simulation, your first task is to analyze. We present you with realistic messages-emails, SMS, or even voice clips-that mimic real-world attacks.
                </p>
                <ul className="space-y-4">
                  {['Check sender authenticity', 'Inspect hidden URLs', 'Evaluate emotional triggers'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-near-black font-medium">
                      <div className="w-6 h-6 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta text-xs font-bold">✓</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 order-1 lg:order-2 w-full max-w-xl">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-terracotta/5 rounded-[64px] blur-2xl group-hover:bg-terracotta/10 transition-all duration-700" />
                  <div className="relative bg-ivory border border-border-cream p-12 md:p-20 rounded-[64px] shadow-whisper">
                    <img 
                      src="/step-analyze.png" 
                      alt="Analyze Phase Illustration" 
                      className="w-full h-auto drop-shadow-2xl animate-float"
                    />
                  </div>
                </div>
              </div>
            </section>

            
            <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">
              <div className="absolute -right-20 top-0 text-[20rem] font-serif text-terracotta/5 select-none pointer-events-none hidden lg:block">02</div>
              <div className="flex-1 w-full max-w-xl">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-terracotta/5 rounded-[64px] blur-2xl group-hover:bg-terracotta/10 transition-all duration-700" />
                  <div className="relative bg-near-black border border-white/10 p-12 md:p-20 rounded-[64px] shadow-whisper">
                    <img 
                      src="/step-identify.png" 
                      alt="Identify Phase Illustration" 
                      className="w-full h-auto drop-shadow-2xl animate-float-delayed"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-16 h-16 rounded-3xl bg-terracotta/10 flex items-center justify-center mb-8">
                  <Flag className="w-8 h-8 text-terracotta" />
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-near-black mb-8 leading-tight">
                  Spotting the <br /><span className="">Red Flags</span>.
                </h2>
                <p className="text-xl text-olive-gray font-sans leading-relaxed mb-10">
                  Using our interactive interface, you'll flag suspicious elements. This isn't a multiple-choice test-it's a hands-on investigation where you decide what's real and what's fake.
                </p>
                <div className="p-8 bg-ivory border border-border-cream rounded-[40px] shadow-whisper">
                  <p className="text-xs uppercase text-stone-gray font-bold mb-4 tracking-widest ">Live Feedback</p>
                  <p className="text-near-black font-medium leading-relaxed ">
                    "When you highlight a lookalike domain, INTERCEPTOR immediately explains why it's suspicious, building your mental library of tactics."
                  </p>
                </div>
              </div>
            </section>

            
            <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">
              <div className="absolute -left-20 top-0 text-[20rem] font-serif text-terracotta/5 select-none pointer-events-none hidden lg:block">03</div>
              <div className="flex-1 order-2 lg:order-1">
                <div className="w-16 h-16 rounded-3xl bg-terracotta/10 flex items-center justify-center mb-8">
                  <BookOpen className="w-8 h-8 text-terracotta" />
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-near-black mb-8 leading-tight">
                  Master the <br /><span className=" text-terracotta">Tactic</span>.
                </h2>
                <p className="text-xl text-olive-gray font-sans leading-relaxed mb-10">
                  Every simulation ends with a deep-dive breakdown. We explain the psychology behind the attack-whether it's urgency, authority, or scarcity-so you can recognize the same pattern in a different context.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {['Psychology', 'Technical', 'Behavioral', 'Strategic'].map((tag) => (
                    <div key={tag} className="px-6 py-4 bg-warm-sand/30 border border-border-cream rounded-2xl text-near-black font-bold text-sm uppercase tracking-widest text-center">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 order-1 lg:order-2 w-full max-w-xl">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-terracotta/5 rounded-[64px] blur-2xl group-hover:bg-terracotta/10 transition-all duration-700" />
                  <div className="relative bg-ivory border border-border-cream p-12 md:p-20 rounded-[64px] shadow-whisper">
                    <img 
                      src="/step-learn.png" 
                      alt="Learn Phase Illustration" 
                      className="w-full h-auto drop-shadow-2xl animate-float"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          
          <div className="mt-60 p-16 md:p-32 bg-near-black rounded-[64px] shadow-whisper text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-ivory/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-ivory">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-4xl md:text-7xl font-serif text-ivory mb-8 leading-tight">
                Ready to test <br />your <span className=" text-terracotta">instincts</span>?
              </h2>
              <p className="text-xl text-stone-gray mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of users who have transformed their digital awareness from vulnerable to invincible.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/signup" className="btn-terracotta px-10 py-5 text-lg flex items-center gap-3">
                  Start Practice <ChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/about" className="text-ivory font-bold hover:text-terracotta transition-colors">
                  Learn about our mission
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
