import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cookie Policy | INTERCEPTOR",
  description: "Understanding how we use small bits of data to improve your experience.",
};

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-24 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-4">Technology</p>
              <h1 className="text-5xl md:text-8xl font-serif text-near-black leading-tight mb-8">
                Cookie <br />
                <span className=" text-terracotta">Policy</span>.
              </h1>
              <p className="text-xl text-olive-gray font-sans leading-relaxed">
                We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about each cookie category below.
              </p>
            </div>
            <div className="w-full max-w-[400px] lg:max-w-[500px] bg-ivory border border-border-cream p-12 rounded-[64px] shadow-whisper">
              <img 
                src="/cookies-illustration.png" 
                alt="Cookies Illustration" 
                className="w-full h-auto drop-shadow-2xl animate-float"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-ivory p-10 rounded-[48px] border border-border-cream shadow-whisper hover:border-terracotta/30 transition-all">
              <div className="w-12 h-12 bg-terracotta/10 rounded-2xl flex items-center justify-center text-terracotta mb-6">
                <span className="font-bold">01</span>
              </div>
              <h3 className="text-2xl font-serif text-near-black mb-4">Necessary Cookies</h3>
              <p className="text-olive-gray leading-relaxed mb-6">
                These are essential for the platform to function. They handle authentication, security, and basic navigation features.
              </p>
              <span className="inline-block px-3 py-1 bg-terracotta text-ivory text-xs font-bold rounded-full">Always Active</span>
            </div>

            <div className="bg-ivory p-10 rounded-[48px] border border-border-cream shadow-whisper hover:border-terracotta/30 transition-all">
              <div className="w-12 h-12 bg-terracotta/10 rounded-2xl flex items-center justify-center text-terracotta mb-6">
                <span className="font-bold">02</span>
              </div>
              <h3 className="text-2xl font-serif text-near-black mb-4">Performance Cookies</h3>
              <p className="text-olive-gray leading-relaxed mb-6">
                These help us understand how visitors interact with INTERCEPTOR by collecting and reporting information anonymously.
              </p>
              <span className="inline-block px-3 py-1 bg-warm-sand text-near-black text-xs font-bold rounded-full">Optional</span>
            </div>

            <div className="bg-ivory p-10 rounded-[48px] border border-border-cream shadow-whisper hover:border-terracotta/30 transition-all">
              <div className="w-12 h-12 bg-terracotta/10 rounded-2xl flex items-center justify-center text-terracotta mb-6">
                <span className="font-bold">03</span>
              </div>
              <h3 className="text-2xl font-serif text-near-black mb-4">Functional Cookies</h3>
              <p className="text-olive-gray leading-relaxed mb-6">
                These allow us to remember choices you make (like your language) and provide enhanced, more personal features.
              </p>
              <span className="inline-block px-3 py-1 bg-warm-sand text-near-black text-xs font-bold rounded-full">Optional</span>
            </div>
          </div>

          <div className="mt-24 max-w-4xl">
            <h2 className="text-3xl font-serif text-near-black mb-8">Managing Your Cookies</h2>
            <div className="prose prose-stone text-olive-gray text-lg space-y-6">
              <p>
                You can change your cookie settings at any time by clicking on our Cookie Consent banner or by adjusting your browser settings. Most browsers allow you to refuse or delete cookies, though this may impact your experience on our platform.
              </p>
              <p>
                For more information on how we handle your data, please visit our <a href="/privacy" className="text-terracotta hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <div className="mt-16 p-12 bg-near-black text-ivory rounded-[56px] flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-md">
                <h3 className="text-2xl font-serif mb-2">Respecting Your Choice</h3>
                <p className="text-stone-gray text-sm">We value your privacy over everything else. We only track what's absolutely necessary.</p>
              </div>
              <button className="btn-ivory !text-near-black !px-12 !py-4 w-full md:w-auto whitespace-nowrap">Reset All Cookies</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
