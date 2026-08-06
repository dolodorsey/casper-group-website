import type { Metadata } from 'next';
import CasperCommercePage from '@/components/casper-commerce/CasperCommercePage';
import { remainingCasperBrands } from '@/lib/casper-commerce-config';
import { buildCasperCommerceMetadata } from '@/lib/casper-commerce-metadata';

const brand = remainingCasperBrands['american-dragon'];
export const metadata: Metadata = buildCasperCommerceMetadata(brand);

export default function AmericanDragonPage() {
  return <CasperCommercePage brand={brand} />;
}
