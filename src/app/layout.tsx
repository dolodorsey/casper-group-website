import type { Metadata, Viewport } from "next";
import InstallAppPrompt from "../components/InstallAppPrompt";
import "./globals.css";
import "../components/casper-multipage/casper-ui-v3.css";
import "../components/casper-multipage/casper-ui-v3-fixes.css";
import "../components/casper-multipage/casper-transparent-assets.css";
import "../components/casper-multipage/casper-global-polish.css";
import "../components/casper-multipage/casper-menu-polish.css";
import "../components/casper-multipage/casper-regression-recovery.css";

export const viewport:Viewport={themeColor:'#111111',colorScheme:'dark',width:'device-width',initialScale:1,viewportFit:'cover'};
export const metadata: Metadata = {
  title: "Casper Group Worldwide — Restaurant Empire",
  description: "A multi-concept restaurant empire. From fine dining to fast casual, every brand in the Casper universe tells its own story.",
  applicationName:'Casper Group',
  appleWebApp:{capable:true,title:'Casper Group',statusBarStyle:'black-translucent'},
  icons:{icon:[{url:'/api/pwa-icon?size=192',sizes:'192x192',type:'image/png'},{url:'/api/pwa-icon?size=512',sizes:'512x512',type:'image/png'}],apple:[{url:'/api/pwa-icon?size=180',sizes:'180x180',type:'image/png'}]},
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
    <body>{children}<InstallAppPrompt/></body>
  </html>;
}
