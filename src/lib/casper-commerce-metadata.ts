import type { Metadata } from 'next';
import type { CasperCommerceBrand } from './casper-commerce-config';

export function buildCasperCommerceMetadata(brand: CasperCommerceBrand): Metadata {
  const siteRoot = 'https://caspergroupworldwide.com';
  const pageUrl = `${siteRoot}/${brand.slug}`;
  const title = `${brand.name} — ${brand.heroAccent.replace(/[.!]+$/g, '')}`;

  return {
    metadataBase: new URL(siteRoot),
    title,
    description: brand.heroCopy,
    keywords: [
      brand.name,
      brand.format,
      `${brand.name} Atlanta`,
      `${brand.name} catering`,
      'Casper Group',
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      siteName: brand.name,
      title,
      description: brand.heroCopy,
      images: [{
        url: brand.heroImage,
        width: 1200,
        height: 630,
        alt: `${brand.name} — ${brand.format}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: brand.heroCopy,
      images: [brand.heroImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}
