import type { Metadata } from "next";

const siteUrl = "https://caspergroupworldwide.com/taco-yaki";

export const metadata: Metadata = {
  metadataBase: new URL("https://caspergroupworldwide.com"),
  title: "Taco Yaki — Tacos Meet Hibachi",
  description:
    "Hibachi-fired tacos, bowls, platters, catering, and live-grill service. Build a Taco Yaki order request online.",
  keywords: [
    "Taco Yaki",
    "hibachi tacos",
    "Atlanta tacos",
    "hibachi catering",
    "live grill catering",
    "Casper Group",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Taco Yaki",
    title: "Taco Yaki — Tacos Meet Hibachi",
    description:
      "Fire-grilled hibachi flavor folded into tacos, bowls, platters, and event service.",
    images: [
      {
        url: "/images/portal-taco-yaki.jpeg",
        width: 1200,
        height: 630,
        alt: "Taco Yaki — Tacos Meet Hibachi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taco Yaki — Tacos Meet Hibachi",
    description: "Fire-grilled tacos, hibachi bowls, platters, and catering.",
    images: ["/images/portal-taco-yaki.jpeg"],
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

export default function TacoYakiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
