import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casper Group Worldwide — Restaurant Empire",
  description: "A multi-concept restaurant empire. From fine dining to fast casual, every brand in the Casper universe tells its own story.",
  openGraph: { title: "Casper Group Worldwide", description: "The restaurant empire.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
    <head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FoodEstablishment",
        "name": "Casper Group",
        "description": "Ghost-themed food and beverage empire with multiple restaurant concepts including Patty Daddy, Taco Yaki, Morning After, Sweet Tooth, and Mojo Juice.",
        "url": "https://caspergroupworldwide.com",
        "servesCuisine": ["American", "Fusion", "Breakfast", "Desserts", "Juice"],
        "address": {"@type": "PostalAddress", "addressLocality": "Atlanta", "addressRegion": "GA", "addressCountry": "US"},
        "parentOrganization": {"@type": "Organization", "name": "The Kollective Hospitality Group", "url": "https://doctordorsey.com"}
      }) }} />
    </head>
    <body>{children}</body>
  </html>;
}
