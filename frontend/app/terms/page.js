import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | INTERCEPTOR",
  description: "The clear and simple rules for using INTERCEPTOR.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-24 flex flex-col lg:flex-row-reverse items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-4">Agreement</p>
              <h1 className="text-5xl md:text-8xl font-serif text-near-black leading-tight mb-8">
                Terms of <br />
                <span className=" text-terracotta">Service</span>.
              </h1>
              <p className="text-xl text-olive-gray font-sans leading-relaxed">
                By using INTERCEPTOR, you agree to these simple rules. We've designed our terms to be as clear and straightforward as possible.
              </p>
            </div>
            <div className="w-full max-w-[400px] lg:max-w-[500px] bg-ivory border border-border-cream p-12 rounded-[64px] shadow-whisper">
              <img 
                src="/terms-illustration.png" 
                alt="Terms Illustration" 
                className="w-full h-auto drop-shadow-2xl animate-float"
              />
            </div>
          </header>

          <div className="max-w-4xl mx-auto space-y-24">
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <span className="text-4xl font-serif text-terracotta/20">01</span>
              </div>
              <div className="md:col-span-3">
                <h2 className="text-3xl font-serif text-near-black mb-6">Acceptance of Terms</h2>
                <p className="text-lg text-olive-gray leading-relaxed">
                  By accessing or using the INTERCEPTOR platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms apply to all visitors, users, and others who access the service.
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <span className="text-4xl font-serif text-terracotta/20">02</span>
              </div>
              <div className="md:col-span-3">
                <h2 className="text-3xl font-serif text-near-black mb-6">Service Usage</h2>
                <p className="text-lg text-olive-gray leading-relaxed mb-6">
                  INTERCEPTOR provides a platform for education and practice. You agree to use the service only for its intended educational purposes. 
                </p>
                <div className="p-8 bg-warm-sand/20 rounded-3xl border border-border-cream/50 space-y-4">
                  <p className="font-bold text-near-black">Prohibited Actions:</p>
                  <ul className="list-disc pl-6 space-y-2 text-olive-gray">
                    <li>Using simulations to deceive or harm others.</li>
                    <li>Attempting to reverse engineer or bypass platform security.</li>
                    <li>Sharing account credentials with unauthorized parties.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <span className="text-4xl font-serif text-terracotta/20">03</span>
              </div>
              <div className="md:col-span-3">
                <h2 className="text-3xl font-serif text-near-black mb-6">Intellectual Property</h2>
                <p className="text-lg text-olive-gray leading-relaxed">
                  The INTERCEPTOR platform, including its original content, features, and functionality, are and will remain the exclusive property of INTERCEPTOR and its licensors. Our branding, simulations, and educational materials are protected by copyright and trademark laws.
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <span className="text-4xl font-serif text-terracotta/20">04</span>
              </div>
              <div className="md:col-span-3">
                <h2 className="text-3xl font-serif text-near-black mb-6">Limitation of Liability</h2>
                <p className="text-lg text-olive-gray leading-relaxed">
                  While we strive for the highest quality of service, INTERCEPTOR is provided on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee that the platform will always be error-free or uninterrupted.
                </p>
              </div>
            </section>

            <div className="pt-24 border-t border-border-cream text-center">
              <p className="text-olive-gray  mb-8">Need a more detailed version of these terms?</p>
              <a href="mailto:legal@interceptor.com" className="btn-terracotta !px-10 !py-4">Download PDF Version</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
