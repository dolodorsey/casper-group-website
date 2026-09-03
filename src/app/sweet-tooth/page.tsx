import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('sweet-tooth')!;
export const metadata: Metadata = { title: 'Sweet Tooth | Casper Group', description: `${profile.tagline} ${profile.description}`, alternates: { canonical: 'https://caspergroupworldwide.com/sweet-tooth' }, openGraph: { title: 'Sweet Tooth | Casper Group', description: profile.description, url: 'https://caspergroupworldwide.com/sweet-tooth', siteName: 'Sweet Tooth', images: [profile.heroImage], type: 'website' } };
export default function SweetToothPage() { return <CasperBrandHomePage profile={profile} />; }
