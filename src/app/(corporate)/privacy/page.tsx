import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'Privacy Policy | Casper Group Worldwide',
  description: 'Privacy practices for Casper Group Worldwide and the restaurant experiences hosted on this website.',
  alternates: { canonical: 'https://caspergroupworldwide.com/privacy' },
};

export default function PrivacyPage() { return <CorporatePage kind="privacy" />; }
