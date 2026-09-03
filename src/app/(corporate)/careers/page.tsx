import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'Careers | Casper Group Worldwide',
  description: 'Explore operations, growth, technology, data, corporate, and field opportunities with Casper Group.',
  alternates: { canonical: 'https://caspergroupworldwide.com/careers' },
};

export default function CareersPage() { return <CorporatePage kind="careers" />; }
