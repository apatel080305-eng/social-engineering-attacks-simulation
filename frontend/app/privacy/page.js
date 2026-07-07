import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | INTERCEPTOR",
  description: "How we look after your information with care and transparency.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-24 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-4">Data Protection</p>
              <h1 className="text-5xl md:text-8xl font-serif text-near-black leading-tight mb-8">
                Your privacy, <br />
                <span className=" text-terracotta">respected</span>.
              </h1>
              <p className="text-xl text-olive-gray font-sans leading-relaxed">
                At INTERCEPTOR, we believe privacy is a fundamental right. We are committed to transparency and the highest standards of data protection.
              </p>
            </div>
            <div className="w-full max-w-[400px] lg:max-w-[500px] bg-ivory border border-border-cream p-12 rounded-[64px] shadow-whisper">
              <img 
                src="/privacy-illustration.png" 
                alt="Privacy Illustration" 
                className="w-full h-auto drop-shadow-2xl animate-float"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-20">
              <section>
                <h2 className="text-3xl font-serif text-near-black mb-8">1. Information We Collect</h2>
                <div className="prose prose-stone max-w-none text-olive-gray space-y-6 text-lg leading-relaxed">
                  <p>
                    We collect only the essential information needed to provide you with our security simulation services. This includes account details (name, email) and usage data related to your progress in our practice modules.
                  </p>
                  <ul className="list-disc pl-6 space-y-4">
                    <li><strong>Personal Identifiers:</strong> Name, email address, and account credentials.</li>
                    <li><strong>Usage Data:</strong> Performance metrics, module completion, and interaction history.</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, and device information to ensure platform security.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-near-black mb-8">2. Global Standards (GDPR & CCPA)</h2>
                <div className="prose prose-stone max-w-none text-olive-gray space-y-6 text-lg leading-relaxed">
                  <p>
                    We comply with global data protection regulations, including the General Data Protection Regulation (GDPR) in the EU and the California Consumer Privacy Act (CCPA).
                  </p>
                  <div className="bg-ivory border border-border-cream p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-near-black">Your Rights Under GDPR:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                        Right to access your data
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                        Right to rectification
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                        Right to erasure ("forgetting")
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                        Right to data portability
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-near-black mb-8">3. How We Use Your Data</h2>
                <p className="text-lg text-olive-gray leading-relaxed mb-6">
                  Your information is used strictly to enhance your learning experience. We analyze aggregate, non-identifiable data to improve our simulation algorithms and scenario accuracy.
                </p>
                <p className="text-lg text-olive-gray leading-relaxed font-bold text-near-black">
                  We never sell your personal information to third parties.
                </p>
              </section>
            </div>

            <aside className="space-y-12">
              <div className="bg-near-black text-ivory p-10 rounded-[48px] shadow-whisper">
                <h3 className="text-xl font-serif mb-6">Security First</h3>
                <p className="text-[#b0aea5] text-sm leading-relaxed mb-8">
                  Our systems are designed with "Privacy by Design" principles. Every piece of data is encrypted and stored using industry-leading protocols.
                </p>
                <div className="h-px bg-white/10 mb-8" />
                <p className="text-xs text-stone-gray ">
                  Last updated: May 6, 2026
                </p>
              </div>

              <div className="p-8 border border-border-cream rounded-[40px]">
                <h3 className="font-serif text-lg mb-4 text-near-black">Questions?</h3>
                <p className="text-sm text-olive-gray mb-6">
                  Our Data Protection Officer is here to help with any privacy concerns.
                </p>
                <a href="/contact" className="text-terracotta font-bold hover:underline">Contact Privacy Team →</a>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
