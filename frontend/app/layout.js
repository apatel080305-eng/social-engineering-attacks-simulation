import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://interceptor-simulation.com"),
  title: {
    default: "INTERCEPTOR | Advanced Social Engineering Simulation & Awareness",
    template: "%s | INTERCEPTOR"
  },
  description: "Master the art of defense. INTERCEPTOR is a premium platform for simulating social engineering attacks, training teams to recognize phishing, vishing, and CEO fraud through immersive 3D experiences.",
  keywords: ["Social Engineering Simulation", "Phishing Training", "Cybersecurity Awareness", "INTERCEPTOR", "Threat Intelligence", "Corporate Security Training"],
  authors: [{ name: "INTERCEPTOR Security Team" }],
  creator: "INTERCEPTOR Labs",
  publisher: "INTERCEPTOR Security",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://interceptor-simulation.com",
    title: "INTERCEPTOR | The Gold Standard in Social Engineering Awareness",
    description: "Equip your organization with the intelligence to intercept digital threats. Immersive simulations for a safer digital world.",
    siteName: "INTERCEPTOR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "INTERCEPTOR Simulation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "INTERCEPTOR | Advanced Phishing & Social Engineering Defense",
    description: "Don't just detect threats. Intercept them. The most advanced simulation platform for modern security teams.",
    images: ["/og-image.png"],
    creator: "@interceptor_sec",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-id", 
  },
  category: "technology",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "INTERCEPTOR",
    "operatingSystem": "Web-based",
    "applicationCategory": "EducationalApplication, SecurityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Advanced social engineering simulation platform for cybersecurity awareness.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1024"
    }
  };

  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-terracotta/20`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="New York" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
      </head>
      <body className="bg-parchment text-near-black font-sans leading-relaxed">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#faf9f5",
              color: "#141413",
              border: "1px solid #e8e6dc",
              borderRadius: "12px",
              fontSize: "15px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
