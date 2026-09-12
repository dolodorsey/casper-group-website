import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { casperBrandSlugs, getCasperSiteProfile } from '@/lib/casper-site-registry';

const DEDICATED_HOME_ROUTES = new Set(['angel-wings', 'espresso-co', 'pasta-bish', 'taco-yaki']);

type BrandHomeRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return casperBrandSlugs
    .filter((slug) => !DEDICATED_HOME_ROUTES.has(slug))
    .map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: BrandHomeRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getCasperSiteProfile(slug);
  if (!profile) return {};
  const title = `${profile.name} | Casper Group`;
  const description = `${profile.tagline} ${profile.description}`;
  const url = `https://caspergroupworldwide.com/${profile.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: profile.name, images: [profile.heroImage], type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [profile.heroImage] },
  };
}

export default async function CasperBrandHomeRoute({ params }: BrandHomeRouteProps) {
  const { slug } = await params;
  const profile = getCasperSiteProfile(slug);
  if (!profile || DEDICATED_HOME_ROUTES.has(slug)) notFound();
  return <CasperBrandHomePage profile={profile} />;
}
