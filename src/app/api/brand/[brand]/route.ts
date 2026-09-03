import { NextRequest, NextResponse } from 'next/server';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const EDGE_BASE = `${SUPABASE_URL}/functions/v1`;
const WEB_GATEWAY = `${EDGE_BASE}/casper-web-gateway`;

function response(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function edgeTarget(brand: string, resource?: string) {
  const profile = getCasperSiteProfile(brand);
  if (!profile) return null;
  if (profile.backend === 'dedicated' && profile.edgeFunction) {
    const suffix = resource ? `?resource=${encodeURIComponent(resource)}` : '';
    return `${EDGE_BASE}/${profile.edgeFunction}${suffix}`;
  }
  const params = new URLSearchParams({ brand: profile.apiSlug });
  if (resource) params.set('resource', resource);
  return `${EDGE_BASE}/casper-brand-intake?${params.toString()}`;
}

function normalizedPayload(brand: string, type: string, raw: Record<string, unknown>) {
  const profile = getCasperSiteProfile(brand);
  if (!profile) return { type, payload: raw };

  const payload: Record<string, unknown> = { ...raw };
  let backendType = type;

  if (type === 'service') {
    backendType = profile.serviceMode;
    const requestType = String(payload.requestType || 'catering');
    payload.eventType = payload.eventType || requestType;
    payload.serviceType = payload.serviceType || requestType;
    payload.company = payload.company || payload.organization || '';
  }

  if (type === 'club') {
    backendType = profile.clubMode;
    const favorite = payload.favorite || '';
    if (brand === 'espresso-co') payload.preferredDrink = payload.preferredDrink || favorite;
    if (brand === 'pasta-bish') payload.favoritePasta = payload.favoritePasta || favorite;
    if (brand === 'taco-yaki') payload.favoriteBuild = payload.favoriteBuild || favorite;
  }

  return { type: backendType, payload };
}

async function proxy(upstream: Response) {
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function GET(request: NextRequest, { params }: { params: { brand: string } }) {
  const profile = getCasperSiteProfile(params.brand);
  if (!profile) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

  const resource = request.nextUrl.searchParams.get('resource') || 'menu';
  if (resource === 'locations') {
    try {
      const upstream = await fetch(
        `${WEB_GATEWAY}?resource=brand_locations&brand=${encodeURIComponent(profile.slug)}`,
        { cache: 'no-store' }
      );
      return proxy(upstream);
    } catch (error) {
      console.error('Casper brand locations gateway:', error);
      return response({ ok: false, error: 'Locations are temporarily unavailable.' }, 503);
    }
  }

  if (resource !== 'menu') return response({ ok: false, error: 'Unknown resource.' }, 404);
  const target = edgeTarget(profile.slug, 'menu');
  if (!target) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

  try {
    return proxy(await fetch(target, { cache: 'no-store' }));
  } catch (error) {
    console.error('Casper menu gateway:', error);
    return response({ ok: false, error: 'Menu is temporarily unavailable.' }, 503);
  }
}

export async function POST(request: NextRequest, { params }: { params: { brand: string } }) {
  const profile = getCasperSiteProfile(params.brand);
  if (!profile) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

  try {
    const body = (await request.json()) as { type?: string; payload?: Record<string, unknown> };
    const requestedType = String(body.type || '');
    if (!['order', 'service', 'club', 'contact'].includes(requestedType)) {
      return response({ ok: false, error: 'Unknown request type.' }, 400);
    }

    if (requestedType === 'contact') {
      const upstream = await fetch(WEB_GATEWAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'brand_contact', brand: profile.slug, payload: body.payload || {} }),
        cache: 'no-store',
      });
      return proxy(upstream);
    }

    const normalized = normalizedPayload(profile.slug, requestedType, body.payload || {});
    const target = edgeTarget(profile.slug);
    if (!target) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

    const upstreamBody = profile.backend === 'shared'
      ? { brand: profile.apiSlug, ...normalized }
      : normalized;

    const upstream = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(upstreamBody),
      cache: 'no-store',
    });
    return proxy(upstream);
  } catch (error) {
    console.error('Casper brand gateway:', error);
    return response({ ok: false, error: 'Request could not be completed.' }, 500);
  }
}
