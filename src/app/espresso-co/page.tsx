import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('espresso-co')!;

export const metadata: Metadata = {
  title: 'Espresso Co. | Casper Group',
  description: `${profile.tagline} ${profile.description}`,
  alternates: { canonical: 'https://caspergroupworldwide.com/espresso-co' },
  openGraph: {
    title: 'Espresso Co. | Casper Group',
    description: profile.description,
    url: 'https://caspergroupworldwide.com/espresso-co',
    siteName: 'Espresso Co.',
    images: [profile.heroImage],
    type: 'website',
  },
};

export default function EspressoCoPage() {
  return <CasperBrandHomePage profile={profile} />;
}
