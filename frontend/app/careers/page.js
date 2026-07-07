import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Careers | INTERCEPTOR",
  description: "Join us in our journey to help everyone stay safe online.",
};

export default function CareersPage() {
  const openings = [
    { title: "Design Lead", team: "Design", type: "Remote / SF" },
    { title: "Trick Simulation Builder", team: "Content", type: "Remote / SF" },
    { title: "Website Builder (Next.js)", team: "Engineering", type: "Remote" },
    { title: "Operations Lead", team: "Operations", type: "London / SF" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      <main className="flex-grow py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-24">
            <h1 className="text-5xl md:text-6xl mb-8">Help us make the <br /> internet safer.</h1>
            <p className="text-xl text-olive-gray max-w-2xl leading-relaxed">
              We're looking for friendly people who care about helping others and building tools that make a difference.
            </p>
          </header>

          <section className="mb-32">
            <h2 className="text-sm uppercase tracking-widest text-terracotta mb-12 font-sans font-semibold">Open Positions</h2>
            <div className="border-t border-border-cream">
              {openings.map((job, idx) => (
                <div key={idx} className="group py-8 border-b border-border-cream flex items-center justify-between hover:bg-ivory transition-colors px-4 -mx-4 rounded-lg">
                  <div>
                    <h3 className="text-2xl mb-1 group-hover:text-terracotta transition-colors">{job.title}</h3>
                    <div className="flex gap-4 text-sm text-stone-gray font-sans">
                      <span>{job.team}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <button className="btn-warm-sand py-2 px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-ivory border border-border-cream rounded-[40px] p-12 md:p-20">
            <h2 className="text-3xl mb-12">Why join INTERCEPTOR?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl mb-4">Focus on impact</h3>
                <p className="text-olive-gray leading-relaxed">We focus on work that really helps people. Every small change you make helps someone stay safe.</p>
              </div>
              <div>
                <h3 className="text-xl mb-4">Work from anywhere</h3>
                <p className="text-olive-gray leading-relaxed">Work from wherever you feel most happy. We believe in trust and flexibility.</p>
              </div>
              <div>
                <h3 className="text-xl mb-4">Ownership</h3>
                <p className="text-olive-gray leading-relaxed">Every team member is an owner. We grow together and share in our success.</p>
              </div>
              <div>
                <h3 className="text-xl mb-4">Caring Benefits</h3>
                <p className="text-olive-gray leading-relaxed">We look after our team with health support, learning budgets, and time to rest.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
