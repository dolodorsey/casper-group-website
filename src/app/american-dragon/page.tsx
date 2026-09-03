import type { Metadata } from 'next';
import CasperBrandHomePage from '@/components/casper-multipage/CasperBrandHomePage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const profile = getCasperSiteProfile('american-dragon')!;
export const metadata: Metadata = { title: 'American Dragon | Casper Group', description: `${profile.tagline} ${profile.description}`, alternates: { canonical: 'https://caspergroupworldwide.com/american-dragon' }, openGraph: { title: 'American Dragon | Casper Group', description: profile.description, url: 'https://caspergroupworldwide.com/american-dragon', siteName: 'American Dragon', images: [profile.heroImage], type: 'website' } };
export default function AmericanDragonPage() { return <CasperBrandHomePage profile={profile} />; }
