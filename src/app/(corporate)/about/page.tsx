import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'About Casper Group Worldwide',
  description: 'Casper Group is a multi-concept restaurant platform built for hospitality, delivery, events, and scalable kitchen networks.',
  alternates: { canonical: 'https://caspergroupworldwide.com/about' },
};

export default function AboutPage() { return <CorporatePage kind="about" />; }
