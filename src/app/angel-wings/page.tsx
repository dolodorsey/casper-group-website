import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('angel-wings')!;

export const metadata: Metadata = {
  title: 'Angel Wings | Casper Group',
  description: `${profile.tagline} ${profile.description}`,
  alternates: { canonical: 'https://caspergroupworldwide.com/angel-wings' },
  openGraph: {
    title: 'Angel Wings | Casper Group',
    description: profile.description,
    url: 'https://caspergroupworldwide.com/angel-wings',
    siteName: 'Angel Wings',
    images: [profile.heroImage],
    type: 'website',
  },
};

export default function AngelWingsPage() {
  return <CasperBrandHomePage profile={profile} />;
}
