import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'Contact | Casper Group Worldwide',
  description: 'Corporate contact for Casper Group venue opportunities, vendors, partnerships, investors, technology, and general business inquiries.',
  alternates: { canonical: 'https://caspergroupworldwide.com/contact' },
};

export default function ContactPage() { return <CorporatePage kind="contact" />; }
