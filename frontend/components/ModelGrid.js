export default function ModelGrid() {
  const models = [
    {
      name: "Fake Emails",
      tag: "Common Trick",
      desc: "Practice finding the small mistakes in fake emails that try to look like they are from a real company.",
      specs: ["Wrong links", "Spelling errors", "Strange senders"],
      image: "/email-trick.png"
    },
    {
      name: "Urgent Messages",
      tag: "Pressure",
      desc: "Learn how to stay calm when you get a message saying something must be done right now.",
      specs: ["Short deadlines", "Scary warnings", "Action required"],
      image: "/urgent-trick.png"
    },
    {
      name: "Fake Logins",
      tag: "Easy Mistake",
      desc: "See how some websites try to look exactly like your real login page to steal your information.",
      specs: ["Fake addresses", "Missing locks", "Hidden forms"],
      image: "/login-trick.png"
    }
  ];

  return (
    <section id="models" className="py-24 md:py-32 px-6 bg-near-black text-ivory">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-[52px] mb-6 text-ivory">
            Common tricks to practice.
          </h2>
          <p className="text-lg text-warm-silver/70 max-w-2xl mx-auto  font-serif">
            Practice against simple situations that happen every day to help you stay safe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
          {models.map((model, idx) => (
            <div key={idx} className="bg-dark-surface border border-ivory/10 p-10 flex flex-col h-full hover:bg-ivory/5 transition-colors cursor-default">
              <div className="text-[10px] uppercase tracking-widest text-coral mb-4 font-sans font-semibold">
                {model.tag}
              </div>
              <h3 className="text-3xl mb-6 text-ivory">{model.name}</h3>
              <p className="text-[#b0aea5]/80 mb-10 min-h-[80px]">
                {model.desc}
              </p>

              <div className="mt-auto pt-8 border-t border-ivory/10 space-y-3">
                {model.specs.map((spec, sidx) => (
                  <div key={sidx} className="flex items-center gap-3 text-sm text-[#b0aea5]/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40" />
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="text-coral hover:text-terracotta font-medium transition-colors border-b border-coral/30 hover:border-terracotta">
            Compare all capabilities →
          </button>
        </div>
      </div>
    </section>
  );
}
