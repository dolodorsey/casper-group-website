import type { Metadata } from 'next';
import CasperCommercePage from '@/components/casper-commerce/CasperCommercePage';
import { remainingCasperBrands } from '@/lib/casper-commerce-config';
import { buildCasperCommerceMetadata } from '@/lib/casper-commerce-metadata';

const brand = remainingCasperBrands['the-morning-after'];
export const metadata: Metadata = buildCasperCommerceMetadata(brand);

export default function TheMorningAfterPage() {
  return <CasperCommercePage brand={brand} />;
}
