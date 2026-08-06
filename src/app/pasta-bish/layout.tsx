import type { Metadata } from "next";

const siteUrl = "https://caspergroupworldwide.com/pasta-bish";

export const metadata: Metadata = {
  metadataBase: new URL("https://caspergroupworldwide.com"),
  title: "Pasta Bish — Comfort with Attitude",
  description:
    "Sauce-first pasta bowls, baked favorites, family trays, catering, and first-access drops. Build a Pasta Bish order request online.",
  keywords: [
    "Pasta Bish",
    "Atlanta pasta",
    "pasta catering",
    "family pasta trays",
    "delivery pasta bowls",
    "Casper Group",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Pasta Bish",
    title: "Pasta Bish — Comfort with Attitude",
    description:
      "Sauce first. Comfort on demand. Build a pasta bowl, request catering, or join the Pasta Bish Club.",
    images: [
      {
        url: "/images/portal-pasta-bish.jpeg",
        width: 1200,
        height: 630,
        alt: "Pasta Bish — Comfort with Attitude",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pasta Bish — Comfort with Attitude",
    description: "Sauce-first pasta bowls, family trays, and catering.",
    images: ["/images/portal-pasta-bish.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function PastaBishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
