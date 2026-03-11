import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casper Group Worldwide — Restaurant Empire",
  description: "A multi-concept restaurant empire. From fine dining to fast casual, every brand in the Casper universe tells its own story.",
  openGraph: { title: "Casper Group Worldwide", description: "The restaurant empire.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
