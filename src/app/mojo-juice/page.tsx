import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('mojo-juice')!;
export const metadata: Metadata = { title: 'Mojo Juice | Casper Group', description: `${profile.tagline} ${profile.description}`, alternates: { canonical: 'https://caspergroupworldwide.com/mojo-juice' }, openGraph: { title: 'Mojo Juice | Casper Group', description: profile.description, url: 'https://caspergroupworldwide.com/mojo-juice', siteName: 'Mojo Juice', images: [profile.heroImage], type: 'website' } };
export default function MojoJuicePage() { return <CasperBrandHomePage profile={profile} />; }
