import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | INTERCEPTOR",
  description: "Get in touch with the INTERCEPTOR team.",
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "hello@interceptor.com",
      description: "Expect a response within 24 hours.",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      content: "Available 9am - 5pm EST",
      description: "Fastest way to get help for quick issues.",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 000-0000",
      description: "Mon-Fri from 9am to 6pm.",
    },
    {
      icon: MapPin,
      title: "Office",
      content: "123 Innovation Way, SF",
      description: "Come visit our friendly office.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-parchment">
      <Header />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            <div>
              <p className="text-terracotta font-mono text-xs uppercase tracking-widest font-bold mb-4">Contact Us</p>
              <h1 className="text-5xl md:text-7xl font-serif text-near-black leading-tight mb-8">
                Let's start a <span className="">friendly</span> conversation.
              </h1>
              <p className="text-xl text-olive-gray font-sans mb-12 max-w-lg">
                Whether you have questions about our practice situations, need help with your account, or just want to say hi, we're here to listen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {contactInfo.map((info, i) => (
                  <div key={i} className="group">
                    <div className="w-12 h-12 bg-warm-sand/30 rounded-2xl flex items-center justify-center text-terracotta mb-4 group-hover:scale-110 transition-transform">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-serif text-near-black mb-1">{info.title}</h3>
                    <p className="text-near-black font-medium mb-1">{info.content}</p>
                    <p className="text-sm text-olive-gray">{info.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
