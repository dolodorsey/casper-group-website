import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CasperMenuBrowser from '@/components/casper-multipage/CasperMenuBrowser';
import { casperBrandSlugs, getCasperSiteProfile } from '@/lib/casper-site-registry';

export const dynamicParams = false;

type MenuRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return casperBrandSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: MenuRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getCasperSiteProfile(slug);
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

export default async function CasperMenuRoute({ params }: MenuRouteProps) {
  const { slug } = await params;
  const profile = getCasperSiteProfile(slug);
  if (!profile) notFound();
  return <CasperMenuBrowser profile={profile} />;
}
