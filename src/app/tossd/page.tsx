import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('tossd')!;
export const metadata: Metadata = { title: 'Toss’d | Casper Group', description: `${profile.tagline} ${profile.description}`, alternates: { canonical: 'https://caspergroupworldwide.com/tossd' }, openGraph: { title: 'Toss’d | Casper Group', description: profile.description, url: 'https://caspergroupworldwide.com/tossd', siteName: 'Toss’d', images: [profile.heroImage], type: 'website' } };
export default function TossdPage() { return <CasperBrandHomePage profile={profile} />; }
