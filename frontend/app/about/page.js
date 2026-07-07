import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Users, Heart, Zap } from "lucide-react";

export const metadata = {
  title: "Our Story | INTERCEPTOR",
  description: "Learn about the mission, values, and people behind the INTERCEPTOR simulation platform.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow pt-32 pb-40 px-6 overflow-hidden">
        <article className="max-w-7xl mx-auto">

          
          <header className="text-center mb-32 max-w-4xl mx-auto">
            <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-4">Our Mission</p>
            <h1 className="text-5xl md:text-8xl font-serif text-near-black leading-tight mb-8">
              Protecting the <br />
              <span className=" text-terracotta">Human</span> Element.
            </h1>
            <p className="text-xl text-olive-gray font-sans leading-relaxed">
              We started INTERCEPTOR because technology alone isn't enough. We believe in empowering people with the intelligence to spot tricks before they happen.
            </p>
          </header>

          <div className="space-y-48">

            
            <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center mb-8">
                  <Shield className="w-6 h-6 text-terracotta" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-near-black mb-6 leading-tight">The Vision</h2>
                <p className="text-lg text-olive-gray font-sans leading-relaxed mb-6">
                  In a world of increasingly sophisticated digital threats, the most vulnerable point is often the human connection. INTERCEPTOR was born from the need for a safer, friendlier way to practice defense.
                </p>
                <p className="text-lg text-olive-gray font-sans leading-relaxed">
                  We don't just provide simulations; we build confidence. Our platform is a safe space to make mistakes, learn from them, and emerge stronger.
                </p>
              </div>
              <div className="flex-1 w-full max-w-2xl">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-terracotta/5 rounded-[64px] blur-2xl group-hover:bg-terracotta/10 transition-all duration-700" />
                  <div className="relative bg-ivory border border-border-cream p-8 md:p-16 rounded-[64px] shadow-whisper overflow-hidden">
                    <img
                      src="/about-hero.png"
                      alt="Team and Protection Illustration"
                      className="w-full h-auto drop-shadow-2xl animate-float"
                    />
                  </div>
                </div>
              </div>
            </section>

            
            <section>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-serif text-near-black mb-6 ">Our Core Beliefs</h2>
                <p className="text-olive-gray max-w-2xl mx-auto">These values guide every simulation we build and every feature we design.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-ivory border border-border-cream p-12 rounded-[48px] shadow-whisper hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center mb-8">
                    <Zap className="w-6 h-6 text-terracotta" />
                  </div>
                  <h3 className="text-2xl font-serif text-near-black mb-4">Clarity First</h3>
                  <p className="text-olive-gray leading-relaxed">
                    Security shouldn't be confusing. we translate complex technical threats into simple, actionable intelligence that everyone can understand.
                  </p>
                </div>
                <div className="bg-near-black text-ivory border border-white/5 p-12 rounded-[48px] shadow-whisper hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-ivory/10 flex items-center justify-center mb-8 text-ivory">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">Radical Empathy</h3>
                  <p className="text-[#b0aea5] leading-relaxed">
                    Social engineering exploits human psychology. We treat every learner with respect, understanding that mistakes are the best way to learn.
                  </p>
                </div>
                <div className="bg-ivory border border-border-cream p-12 rounded-[48px] shadow-whisper hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center mb-8">
                    <Users className="w-6 h-6 text-terracotta" />
                  </div>
                  <h3 className="text-2xl font-serif text-near-black mb-4">Global Safety</h3>
                  <p className="text-olive-gray leading-relaxed">
                    Our goal is a safer digital world for everyone-from individual families to global enterprises. We build for the scale of the internet.
                  </p>
                </div>
              </div>
            </section>

            
            <section className="bg-ivory border border-border-cream rounded-[64px] p-16 md:p-24 shadow-whisper relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                <div>
                  <div className="text-5xl font-serif text-terracotta mb-2">2023</div>
                  <div className="text-xs uppercase tracking-[0.2em] font-bold text-stone-gray">Founded</div>
                </div>
                <div>
                  <div className="text-5xl font-serif text-near-black mb-2">15k+</div>
                  <div className="text-xs uppercase tracking-[0.2em] font-bold text-stone-gray">Learners</div>
                </div>
                <div>
                  <div className="text-5xl font-serif text-near-black mb-2">500+</div>
                  <div className="text-xs uppercase tracking-[0.2em] font-bold text-stone-gray">Scenarios</div>
                </div>
                <div>
                  <div className="text-5xl font-serif text-near-black mb-2">100%</div>
                  <div className="text-xs uppercase tracking-[0.2em] font-bold text-stone-gray">Committed</div>
                </div>
              </div>
            </section>

          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
