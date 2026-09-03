import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('mr-oyster')!;
export const metadata: Metadata = { title: 'Mr. Oyster | Casper Group', description: `${profile.tagline} ${profile.description}`, alternates: { canonical: 'https://caspergroupworldwide.com/mr-oyster' }, openGraph: { title: 'Mr. Oyster | Casper Group', description: profile.description, url: 'https://caspergroupworldwide.com/mr-oyster', siteName: 'Mr. Oyster', images: [profile.heroImage], type: 'website' } };
export default function MrOysterPage() { return <CasperBrandHomePage profile={profile} />; }
