import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'Restaurant Brands | Casper Group Worldwide',
  description: 'Explore the 12 independent restaurant concepts operated across the Casper Group platform.',
  alternates: { canonical: 'https://caspergroupworldwide.com/brands' },
};

export default function BrandsPage() { return <CorporatePage kind="brands" />; }
