import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('pasta-bish')!;

export const metadata: Metadata = {
  title: 'Pasta Bish | Casper Group',
  description: `${profile.tagline} ${profile.description}`,
  alternates: { canonical: 'https://caspergroupworldwide.com/pasta-bish' },
  openGraph: {
    title: 'Pasta Bish | Casper Group',
    description: profile.description,
    url: 'https://caspergroupworldwide.com/pasta-bish',
    siteName: 'Pasta Bish',
    images: [profile.heroImage],
    type: 'website',
  },
};

export default function PastaBishPage() {
  return <CasperBrandHomePage profile={profile} />;
}
