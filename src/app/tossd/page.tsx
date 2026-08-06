import type { Metadata } from 'next';
import CasperCommercePage from '@/components/casper-commerce/CasperCommercePage';
import { remainingCasperBrands } from '@/lib/casper-commerce-config';
import { buildCasperCommerceMetadata } from '@/lib/casper-commerce-metadata';

const brand = remainingCasperBrands['tossd'];
export const metadata: Metadata = buildCasperCommerceMetadata(brand);

export default function TossdPage() {
  return <CasperCommercePage brand={brand} />;
}
