import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'Terms of Use | Casper Group Worldwide',
  description: 'Website terms for Casper Group Worldwide, restaurant order requests, service inquiries, and site use.',
  alternates: { canonical: 'https://caspergroupworldwide.com/terms' },
};

export default function TermsPage() { return <CorporatePage kind="terms" />; }
