import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('taco-yaki')!;

export const metadata: Metadata = {
  title: 'Taco Yaki | Casper Group',
  description: `${profile.tagline} ${profile.description}`,
  alternates: { canonical: 'https://caspergroupworldwide.com/taco-yaki' },
  openGraph: {
    title: 'Taco Yaki | Casper Group',
    description: profile.description,
    url: 'https://caspergroupworldwide.com/taco-yaki',
    siteName: 'Taco Yaki',
    images: [profile.heroImage],
    type: 'website',
  },
};

export default function TacoYakiPage() {
  return <CasperBrandHomePage profile={profile} />;
}
