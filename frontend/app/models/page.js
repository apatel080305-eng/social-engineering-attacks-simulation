import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Database, Cpu, Search, Sparkles } from "lucide-react";

export const metadata = {
  title: "The Intelligence | INTERCEPTOR",
  description: "Learn about the advanced models and data architecture powering our simulations.",
};

export default function ModelsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow py-32 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          <header className="mb-32 text-center max-w-3xl mx-auto">
            <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-4">Architecture</p>
            <h1 className="text-5xl md:text-8xl font-serif text-near-black leading-tight mb-8">
              The <span className=" text-terracotta">Intelligence</span> <br />
              Behind the Scenes.
            </h1>
            <p className="text-xl text-olive-gray font-sans leading-relaxed">
              We combine advanced vector storage with state-of-the-art reasoning models to create simulations that are not just realistic, but truly educational.
            </p>
          </header>

          <div className="space-y-40">

            
            <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 order-2 lg:order-1">
                <div className="w-16 h-16 rounded-3xl bg-terracotta/10 flex items-center justify-center mb-8">
                  <Database className="w-8 h-8 text-terracotta" />
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-near-black mb-8 leading-tight">
                  Organized <br />
                  <span className="">Knowledge</span>.
                </h2>
                <p className="text-xl text-olive-gray font-sans leading-relaxed mb-10">
                  Every scenario and educational tip is stored in our high-performance vector library. This allows INTERCEPTOR to find the most relevant examples for you in milliseconds.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-ivory border border-border-cream rounded-[40px] shadow-whisper">
                    <p className="text-xs uppercase text-stone-gray font-bold mb-2 tracking-widest">Library Size</p>
                    <p className="text-3xl font-serif text-near-black">Infinite</p>
                    <p className="text-xs text-olive-gray mt-1">Scale-on-demand</p>
                  </div>
                  <div className="p-8 bg-ivory border border-border-cream rounded-[40px] shadow-whisper">
                    <p className="text-xs uppercase text-stone-gray font-bold mb-2 tracking-widest">Provider</p>
                    <p className="text-3xl font-serif text-terracotta">Pinecone</p>
                    <p className="text-xs text-olive-gray mt-1">Managed Vector DB</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 order-1 lg:order-2 w-full max-w-xl">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-terracotta/5 rounded-[64px] blur-2xl group-hover:bg-terracotta/10 transition-all duration-700" />
                  <div className="relative bg-ivory border border-border-cream p-12 md:p-20 rounded-[64px] shadow-whisper overflow-hidden">
                    <img
                      src="/vector-db.png"
                      alt="Vector Database Illustration"
                      className="w-full h-auto drop-shadow-2xl animate-float"
                    />
                  </div>
                </div>
              </div>
            </section>

            
            <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 w-full max-w-xl">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-terracotta/5 rounded-[64px] blur-2xl group-hover:bg-terracotta/10 transition-all duration-700" />
                  <div className="relative bg-near-black border border-white/10 p-12 md:p-20 rounded-[64px] shadow-whisper overflow-hidden">
                    <img
                      src="/ai-model.png"
                      alt="AI Model Illustration"
                      className="w-full h-auto drop-shadow-2xl animate-float-delayed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="w-16 h-16 rounded-3xl bg-terracotta/10 flex items-center justify-center mb-8">
                  <Cpu className="w-8 h-8 text-terracotta" />
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-near-black mb-8 leading-tight">
                  The <br />
                  <span className="">Reasoning</span>.
                </h2>
                <p className="text-xl text-olive-gray font-sans leading-relaxed mb-10">
                  Our simulations understand context, tone, and intent - adapting in real time to the way you respond to teach you more effectively.
                </p>

                <div className="space-y-6">
                  <div className="p-8 bg-ivory border border-border-cream rounded-[40px] shadow-whisper flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase text-stone-gray font-bold mb-1 tracking-widest">Main Engine</p>
                      <p className="text-3xl font-serif text-near-black">Gemma-2-9b</p>
                    </div>
                    <Sparkles className="text-terracotta w-8 h-8 opacity-20" />
                  </div>
                  <div className="p-8 bg-ivory border border-border-cream rounded-[40px] shadow-whisper flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase text-stone-gray font-bold mb-1 tracking-widest">Embedder</p>
                      <p className="text-3xl font-serif text-near-black">text-embedding-3</p>
                    </div>
                    <Search className="text-terracotta w-8 h-8 opacity-20" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          
          <div className="mt-40 p-16 bg-ivory border border-border-cream rounded-[64px] shadow-whisper text-center max-w-5xl mx-auto">
            <h3 className="text-3xl font-serif text-near-black mb-4">World-Class Infrastructure</h3>
            <p className="text-olive-gray mb-10 max-w-2xl mx-auto">
              Everything runs on enterprise-grade cloud servers to ensure that your simulations are always fast, secure, and available when you need them.
            </p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em]">AWS us-east-1</p>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em]">Next.js 14</p>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em]">Pinecone</p>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em]">Google AI</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
