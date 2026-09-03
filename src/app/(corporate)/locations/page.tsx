import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'Locations | Casper Group Worldwide',
  description: 'Explore active Casper Group kitchen locations and service footprints.',
  alternates: { canonical: 'https://caspergroupworldwide.com/locations' },
};

export default function LocationsPage() { return <CorporatePage kind="locations" />; }
