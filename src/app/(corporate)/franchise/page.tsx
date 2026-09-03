import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'Franchise & Partnerships | Casper Group Worldwide',
  description: 'Explore venue, market, operator, kitchen, strategic partnership, and future franchise opportunities with Casper Group.',
  alternates: { canonical: 'https://caspergroupworldwide.com/franchise' },
};

export default function FranchisePage() { return <CorporatePage kind="franchise" />; }
