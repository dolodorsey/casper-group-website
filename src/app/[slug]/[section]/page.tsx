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

export function generateStaticParams() {
  return casperBrandSlugs.flatMap((slug) => SECTION_ROUTES.map((section) => ({ slug, section })));
}

export function generateMetadata({ params }: { params: { slug: string; section: string } }): Metadata {
  const profile = getCasperSiteProfile(params.slug);
  if (!profile || !isCasperSection(params.section) || params.section === 'menu') return {};

  const sectionName = params.section === 'catering' ? profile.serviceLabel : params.section.charAt(0).toUpperCase() + params.section.slice(1);
  const title = `${sectionName} | ${profile.name} — Casper Group`;
  const description = `${profile.name} ${sectionName.toLowerCase()}: ${profile.description}`;
  const canonical = `https://caspergroupworldwide.com/${profile.slug}/${params.section}`;

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

export default function CasperConceptSectionRoute({ params }: { params: { slug: string; section: string } }) {
  const profile = getCasperSiteProfile(params.slug);
  if (!profile || !isCasperSection(params.section) || params.section === 'menu') notFound();
  return (
    <CasperSectionVisualShell profile={profile} section={params.section}>
      <CasperBrandSectionPage profile={profile} section={params.section} />
    </CasperSectionVisualShell>
  );
}
