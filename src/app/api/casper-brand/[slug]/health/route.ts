import { NextResponse } from 'next/server';
import { getRemainingCasperBrand } from '@/lib/casper-commerce-config';

export const dynamic = 'force-dynamic';

const API_URL = 'https://qhgmukwoennurwuvmbhy.supabase.co/functions/v1/casper-brand-intake';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const brand = getRemainingCasperBrand(params.slug);
  if (!brand) {
    return NextResponse.json({ ok: false, error: 'Unknown brand.' }, { status: 404 });
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_URL}?brand=${encodeURIComponent(brand.slug)}&resource=menu`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'User-Agent': `${brand.slug}-health-check/1.0` },
    });
    const data = await response.json() as { ok?: boolean; menu?: unknown[] };
    const healthy = response.ok && data.ok === true && Array.isArray(data.menu) && data.menu.length > 0;

    return NextResponse.json({
      ok: healthy,
      service: `${brand.slug}-website`,
      brand: brand.name,
      checks: {
        website: 'up',
        menuApi: healthy ? 'up' : 'degraded',
        menuItems: Array.isArray(data.menu) ? data.menu.length : 0,
      },
      responseTimeMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    }, {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      service: `${brand.slug}-website`,
      brand: brand.name,
      checks: { website: 'up', menuApi: 'down', menuItems: 0 },
      error: error instanceof Error ? error.name : 'Health check failed',
      responseTimeMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  } finally {
    clearTimeout(timeout);
  }
}
