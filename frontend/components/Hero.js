import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-sand/50 border border-border-warm text-[12px] font-medium text-charcoal-warm uppercase tracking-wider mb-8">
          <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
          Learn to spot online tricks
        </div>
        <h1 className="text-5xl md:text-[64px] font-medium text-near-black mb-8 leading-[1.1]">
          Practice spotting tricks <br className="hidden md:block" />
          before they happen.
        </h1>
        <p className="text-lg md:text-xl text-olive-gray mb-12 max-w-2xl mx-auto leading-relaxed">
          INTERCEPTOR helps you learn how to identify fake messages and suspicious links in a safe, easy-to-understand way.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/signup" className="btn-terracotta w-full sm:w-auto text-lg px-8 py-4 text-center">
            Start Learning
          </Link>
          <Link href="/how-it-works" className="btn-warm-sand w-full sm:w-auto text-lg px-8 py-4 text-center">
            How It Works
          </Link>
        </div>
        
        
        <div className="relative mt-20 p-2 bg-ivory border border-border-cream rounded-[32px] shadow-whisper max-w-5xl mx-auto group">
          <div className="rounded-[24px] overflow-hidden bg-parchment">
            <img 
              src="/hero-illustration.png" 
              alt="Topic AI Automation Flow" 
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
          
          <div className="absolute inset-0 rounded-[32px] shadow-[0_0_0_1px_rgba(232,230,220,1)] pointer-events-none" />
        </div>
      </div>
      
      
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-coral/5 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2" />
    </section>
  );
}
