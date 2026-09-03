import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('peace-pizza')!;
export const metadata: Metadata = { title: 'Peace Pizza | Casper Group', description: `${profile.tagline} ${profile.description}`, alternates: { canonical: 'https://caspergroupworldwide.com/peace-pizza' }, openGraph: { title: 'Peace Pizza | Casper Group', description: profile.description, url: 'https://caspergroupworldwide.com/peace-pizza', siteName: 'Peace Pizza', images: [profile.heroImage], type: 'website' } };
export default function PeacePizzaPage() { return <CasperBrandHomePage profile={profile} />; }
