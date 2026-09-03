import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CasperMenuBrowser from '@/components/casper-multipage/CasperMenuBrowser';
import { casperBrandSlugs, getCasperSiteProfile } from '@/lib/casper-site-registry';

export const dynamicParams = false;

export function generateStaticParams() {
  return casperBrandSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const profile = getCasperSiteProfile(params.slug);
  if (!profile) return {};
  const title = `Menu | ${profile.name} — Casper Group`;
  const description = `Browse ${profile.name} by menu category: ${profile.description}`;
  const canonical = `https://caspergroupworldwide.com/${profile.slug}/menu`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: profile.name, type: 'website', images: [profile.heroImage] },
    twitter: { card: 'summary_large_image', title, description, images: [profile.heroImage] },
  };
}

export default function CasperMenuRoute({ params }: { params: { slug: string } }) {
  const profile = getCasperSiteProfile(params.slug);
  if (!profile) notFound();
  return <CasperMenuBrowser profile={profile} />;
}
