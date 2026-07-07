export default function Features() {
  const features = [
    {
      title: "Finding Clues",
      description: "Learn how to look for small signs that a message might not be from who it says it is.",
      icon: "◈"
    },
    {
      title: "Feeling Urgency",
      description: "See how some messages try to make you act fast without thinking, and learn to slow down.",
      icon: "◇"
    },
    {
      title: "Building Trust",
      description: "Understand how people try to act like someone you know to get your information.",
      icon: "○"
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 px-6 bg-ivory/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-[52px] text-near-black mb-6">
            Simple ways to learn.
          </h2>
          <p className="text-lg text-olive-gray max-w-2xl leading-relaxed">
            We've built INTERCEPTOR to be a friendly place to practice and learn how to stay safe online.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="card-ivory group hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-warm-sand/50 flex items-center justify-center text-terracotta text-2xl mb-8 font-serif">
                {feature.icon}
              </div>
              <h3 className="text-2xl text-near-black mb-4 group-hover:text-terracotta transition-colors">
                {feature.title}
              </h3>
              <p className="text-olive-gray leading-relaxed font-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
