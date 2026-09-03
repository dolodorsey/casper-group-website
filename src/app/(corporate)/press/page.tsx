import type { Metadata } from 'next';
import CorporatePage from '@/components/casper-corporate/CorporatePage';

export const metadata: Metadata = {
  title: 'Press & Media | Casper Group Worldwide',
  description: 'Media, interview, company background, photography, and brand press requests for Casper Group Worldwide.',
  alternates: { canonical: 'https://caspergroupworldwide.com/press' },
};

export default function PressPage() { return <CorporatePage kind="press" />; }
