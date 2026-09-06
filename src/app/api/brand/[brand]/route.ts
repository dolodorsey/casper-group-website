import { NextRequest, NextResponse } from 'next/server';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const EDGE_BASE = `${SUPABASE_URL}/functions/v1`;
const WEB_GATEWAY = `${EDGE_BASE}/casper-web-gateway`;
const UPSTREAM_TIMEOUT_MS = 5000;

function response(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

function unavailableResponse(message: string) {
  return response(
    { ok: false, available: false, error: message },
    503,
    {
      'Retry-After': '30',
      'X-Casper-Data': 'unavailable',
    }
  );
}

async function fetchWithDeadline(input: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    return await fetch(input, {
      ...init,
      cache: 'no-store',
      redirect: 'error',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
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

async function proxy(upstream: Response, unavailableMessage: string) {
  if (upstream.status >= 500) {
    console.error('Casper upstream unavailable:', upstream.status);
    return unavailableResponse(unavailableMessage);
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Casper-Data': upstream.ok ? 'available' : 'rejected',
    },
  });
}

export async function GET(request: NextRequest, { params }: { params: { brand: string } }) {
  const profile = getCasperSiteProfile(params.brand);
  if (!profile) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

  const resource = request.nextUrl.searchParams.get('resource') || 'menu';
  if (resource === 'locations') {
    try {
      const upstream = await fetchWithDeadline(
        `${WEB_GATEWAY}?resource=brand_locations&brand=${encodeURIComponent(profile.slug)}`,
        { headers: { Accept: 'application/json' } }
      );
      return proxy(upstream, 'Locations are temporarily unavailable.');
    } catch (error) {
      const errorName = error instanceof Error ? error.name : 'UnknownError';
      console.error('Casper brand locations gateway unavailable:', errorName);
      return unavailableResponse('Locations are temporarily unavailable.');
    }
  }

  if (resource !== 'menu') return response({ ok: false, error: 'Unknown resource.' }, 404);
  const target = edgeTarget(profile.slug, 'menu');
  if (!target) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

  try {
    const upstream = await fetchWithDeadline(target, { headers: { Accept: 'application/json' } });
    return proxy(upstream, 'Menu is temporarily unavailable.');
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error('Casper menu gateway unavailable:', errorName);
    return unavailableResponse('Menu is temporarily unavailable.');
  }
}

export async function POST(request: NextRequest, { params }: { params: { brand: string } }) {
  const profile = getCasperSiteProfile(params.brand);
  if (!profile) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

  try {
    const body = (await request.json()) as { type?: string; payload?: Record<string, unknown> };
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return response({ ok: false, error: 'Invalid request payload.' }, 400);
    }

    const requestedType = String(body.type || '');
    if (!['order', 'service', 'club', 'contact'].includes(requestedType)) {
      return response({ ok: false, error: 'Unknown request type.' }, 400);
    }

    if (requestedType === 'contact') {
      const upstream = await fetchWithDeadline(WEB_GATEWAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ action: 'brand_contact', brand: profile.slug, payload: body.payload || {} }),
      });
      return proxy(upstream, 'Request could not be completed.');
    }

    const normalized = normalizedPayload(profile.slug, requestedType, body.payload || {});
    const target = edgeTarget(profile.slug);
    if (!target) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

    const upstreamBody = profile.backend === 'shared'
      ? { brand: profile.apiSlug, ...normalized }
      : normalized;

    const upstream = await fetchWithDeadline(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(upstreamBody),
    });
    return proxy(upstream, 'Request could not be completed.');
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error('Casper brand gateway unavailable:', errorName);
    return unavailableResponse('Request could not be completed.');
  }
}
