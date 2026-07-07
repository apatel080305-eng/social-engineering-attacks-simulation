import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Overview | INTERCEPTOR",
  description: "Learn how INTERCEPTOR helps you stay safe online.",
};

export default function OverviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-24 text-center">
            <h1 className="text-5xl md:text-7xl font-serif text-near-black mb-8">
              A simpler way to <br />
              <span className=" text-terracotta">stay safe</span>.
            </h1>
            <p className="text-xl text-olive-gray max-w-2xl mx-auto leading-relaxed">
              INTERCEPTOR is a practice-first platform designed to help everyone-regardless of tech skills-identify and avoid online tricks.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <h2 className="text-3xl font-serif mb-6">Learning by doing</h2>
              <p className="text-lg text-olive-gray leading-relaxed mb-8">
                We believe the best way to learn is through experience. INTERCEPTOR provides safe, controlled environments where you can practice identifying fake emails, urgent messages, and fraudulent logins.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-near-black font-medium">
                  <span className="w-2 h-2 rounded-full bg-terracotta" />
                  Real-world scenarios
                </div>
                <div className="flex items-center gap-4 text-near-black font-medium">
                  <span className="w-2 h-2 rounded-full bg-terracotta" />
                  Instant feedback
                </div>
                <div className="flex items-center gap-4 text-near-black font-medium">
                  <span className="w-2 h-2 rounded-full bg-terracotta" />
                  Guided practice sessions
                </div>
              </div>
            </div>
            <div className="bg-ivory border border-border-cream p-12 rounded-[48px] shadow-whisper">
              <img 
                src="/overview-learning.png" 
                alt="Learning Illustration" 
                className="w-full h-auto drop-shadow-2xl animate-float"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
            <div className="order-2 md:order-1 bg-ivory border border-border-cream p-12 rounded-[48px] shadow-whisper">
              <img 
                src="/overview-safety.png" 
                alt="Safety Illustration" 
                className="w-full h-auto drop-shadow-2xl animate-float"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-serif mb-6">Built for everyone</h2>
              <p className="text-lg text-olive-gray leading-relaxed mb-8">
                Online safety shouldn't be complicated. We've removed the technical jargon and complex terminology to focus on what matters: your peace of mind and security.
              </p>
              <div className="p-8 bg-warm-sand/20 rounded-3xl border border-border-cream/50">
                <blockquote className=" text-near-black text-lg">
                  "Our goal is to make the digital world a kinder, safer place for everyone, one practice session at a time."
                </blockquote>
              </div>
            </div>
          </section>

          <section className="text-center py-24 bg-near-black text-ivory rounded-[64px] px-6">
            <h2 className="text-4xl md:text-5xl font-serif mb-8">Ready to start practicing?</h2>
            <p className="text-xl text-[#b0aea5] mb-12 max-w-xl mx-auto">
              Join thousands of others who are learning to spot the clues and stay safe from online tricks.
            </p>
            <button className="btn-terracotta !px-12 !py-5 !text-lg">
              Get Started for Free
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
