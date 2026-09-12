import { NextResponse } from 'next/server';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const EDGE_BASE = `${SUPABASE_URL}/functions/v1`;

function menuTarget(slug: string) {
  const profile = getCasperSiteProfile(slug);
  if (!profile) return null;

  if (profile.backend === 'dedicated' && profile.edgeFunction) {
    return `${EDGE_BASE}/${profile.edgeFunction}?resource=menu`;
  }

  return `${EDGE_BASE}/casper-brand-intake?brand=${encodeURIComponent(profile.apiSlug)}&resource=menu`;
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const profile = getCasperSiteProfile(slug);
  const target = menuTarget(slug);
  if (!profile || !target) {
    return NextResponse.json({ ok: false, error: 'Unknown brand.' }, { status: 404 });
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(target, {
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'User-Agent': `${profile.slug}-health-check/2.0` },
    });
    const data = await response.json() as { ok?: boolean; menu?: unknown[] };
    const healthy = response.ok && data.ok === true && Array.isArray(data.menu) && data.menu.length > 0;

    return NextResponse.json({
      ok: healthy,
      service: `${profile.slug}-website`,
      brand: profile.name,
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
      service: `${profile.slug}-website`,
      brand: profile.name,
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
