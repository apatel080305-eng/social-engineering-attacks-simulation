import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";

export const metadata = {
  title: "Pricing | INTERCEPTOR",
  description: "INTERCEPTOR is completely free to use.",
};

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <header className="mb-20">
            <h1 className="text-5xl md:text-7xl font-serif text-near-black mb-8">
              Practice for <span className=" text-terracotta">everyone</span>.
            </h1>
            <p className="text-xl text-olive-gray max-w-2xl mx-auto leading-relaxed">
              We believe online safety education should be accessible to all. That's why INTERCEPTOR is completely free to use for now.
            </p>
          </header>

          <div className="max-w-lg mx-auto">
            <div className="bg-ivory border-2 border-terracotta rounded-[48px] p-12 shadow-whisper relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-terracotta text-ivory px-6 py-2 rounded-bl-3xl font-mono text-xs uppercase tracking-widest font-bold">
                Current Plan
              </div>
              
              <h2 className="text-3xl font-serif mb-2">Community</h2>
              <div className="flex items-center justify-center gap-1 mb-8">
                <span className="text-5xl font-serif font-bold text-near-black">$0</span>
                <span className="text-olive-gray">/ forever</span>
              </div>

              <div className="space-y-6 text-left mb-12">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-terracotta" />
                  </div>
                  <p className="text-near-black">Unlimited practice sessions</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-terracotta" />
                  </div>
                  <p className="text-near-black">Access to all simulation modules</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-terracotta" />
                  </div>
                  <p className="text-near-black">Progress tracking and history</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-terracotta" />
                  </div>
                  <p className="text-near-black">Community support and resources</p>
                </div>
              </div>

              <button className="w-full btn-terracotta !py-5 !text-lg">
                Get Started
              </button>
            </div>
            
            <p className="mt-12 text-olive-gray  font-serif">
              "Keeping the community safe is our top priority."
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
