import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('patty-daddy')!;

export const metadata: Metadata = {
  title: 'Patty Daddy | Casper Group',
  description: `${profile.tagline} ${profile.description}`,
  alternates: { canonical: 'https://caspergroupworldwide.com/patty-daddy' },
  openGraph: { title: 'Patty Daddy | Casper Group', description: profile.description, url: 'https://caspergroupworldwide.com/patty-daddy', siteName: 'Patty Daddy', images: [profile.heroImage], type: 'website' },
};

export default function PattyDaddyPage() {
  return <CasperBrandHomePage profile={profile} />;
}
