import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CasperBrandSectionPage from '@/components/casper-multipage/CasperBrandSectionPage';
import CasperSectionVisualShell from '@/components/casper-multipage/CasperSectionVisualShell';
import {
  CASPER_SECTIONS,
  casperBrandSlugs,
  getCasperSiteProfile,
  isCasperSection,
} from '@/lib/casper-site-registry';

export const dynamicParams = false;

const SECTION_ROUTES = CASPER_SECTIONS.filter((section) => section !== 'menu');

type SectionRouteProps = {
  params: Promise<{ slug: string; section: string }>;
};

export function generateStaticParams() {
  return casperBrandSlugs.flatMap((slug) => SECTION_ROUTES.map((section) => ({ slug, section })));
}

export async function generateMetadata({ params }: SectionRouteProps): Promise<Metadata> {
  const { slug, section } = await params;
  const profile = getCasperSiteProfile(slug);
  if (!profile || !isCasperSection(section) || section === 'menu') return {};

  const sectionName = section === 'catering' ? profile.serviceLabel : section.charAt(0).toUpperCase() + section.slice(1);
  const title = `${sectionName} | ${profile.name} — Casper Group`;
  const description = `${profile.name} ${sectionName.toLowerCase()}: ${profile.description}`;
  const canonical = `https://caspergroupworldwide.com/${profile.slug}/${section}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: profile.name,
      type: 'website',
      images: [{ url: profile.heroImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [profile.heroImage],
    },
  };
}

export default async function CasperConceptSectionRoute({ params }: SectionRouteProps) {
  const { slug, section } = await params;
  const profile = getCasperSiteProfile(slug);
  if (!profile || !isCasperSection(section) || section === 'menu') notFound();
  return (
    <CasperSectionVisualShell profile={profile} section={section}>
      <CasperBrandSectionPage profile={profile} section={section} />
    </CasperSectionVisualShell>
  );
}
