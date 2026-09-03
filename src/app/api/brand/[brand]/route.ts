import { NextRequest, NextResponse } from 'next/server';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const EDGE_BASE = `${SUPABASE_URL}/functions/v1`;

const CONTACT_TABLES: Record<string, string> = {
  'angel-wings': 'angel_wings_contact_requests',
  'tha-morning-after': 'the_morning_after_contact_requests',
  'patty-daddy': 'patty_daddy_contact_requests',
  'espresso-co': 'espresso_co_contact_requests',
  'mojo-juice': 'mojo_juice_contact_requests',
  'mr-oyster': 'mr_oyster_contact_requests',
  'sweet-tooth': 'sweet_tooth_contact_requests',
  'taco-yaki': 'taco_yaki_contact_requests',
  tossd: 'tossd_contact_requests',
  'pasta-bish': 'pasta_bish_contact_requests',
  'peace-pizza': 'peace_pizza_contact_requests',
  'american-dragon': 'american_dragon_contact_requests',
};

function response(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function clean(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, max) : '';
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

async function rest(path: string, init: RequestInit = {}) {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) throw new Error('Casper data service is not configured.');
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
}

async function getLocations(brand: string) {
  const profile = getCasperSiteProfile(brand);
  if (!profile) return [];

  const brandRes = await rest(`cg_brands?slug=eq.${encodeURIComponent(profile.locationSlug)}&select=id&limit=1`);
  if (!brandRes.ok) throw new Error('Unable to load brand locations.');
  const brandRows = (await brandRes.json()) as Array<{ id: string }>;
  if (!brandRows[0]?.id) return [];

  const linksRes = await rest(
    `location_brands?brand_id=eq.${encodeURIComponent(brandRows[0].id)}&is_active=eq.true&select=location_id`
  );
  if (!linksRes.ok) throw new Error('Unable to load brand locations.');
  const links = (await linksRes.json()) as Array<{ location_id: string }>;
  const ids = links.map((row) => row.location_id).filter(Boolean);
  if (!ids.length) return [];

  const idFilter = ids.join(',');
  const locationsRes = await rest(
    `cg_locations?id=in.(${idFilter})&status=eq.open&select=id,name,address,city,state,kitchen_hours,delivery_platforms,status&order=name.asc`
  );
  if (!locationsRes.ok) throw new Error('Unable to load brand locations.');
  return locationsRes.json();
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

async function saveContact(brand: string, raw: Record<string, unknown>) {
  const table = CONTACT_TABLES[brand];
  if (!table) throw new Error('Unknown contact destination.');

  const customerName = clean(raw.customerName, 160);
  const email = clean(raw.email, 180).toLowerCase();
  const phone = clean(raw.phone, 50);
  const subject = clean(raw.subject, 180);
  const message = clean(raw.message, 4000);
  const orderConfirmation = clean(raw.orderConfirmation, 120);

  if (customerName.length < 2 || !validEmail(email) || subject.length < 2 || message.length < 5) {
    return { ok: false, status: 400, error: 'Enter a valid name, email, subject, and message.' };
  }

  const confirmationCode = `CS-${brand.replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  const save = await rest(table, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      confirmation_code: confirmationCode,
      customer_name: customerName,
      email,
      phone: phone || null,
      subject,
      message,
      order_confirmation: orderConfirmation || null,
      source: `${brand}-website`,
    }),
  });

  if (!save.ok) throw new Error(`Contact request could not be saved (${save.status}).`);
  return {
    ok: true,
    status: 200,
    confirmationCode,
    message: 'Your message is recorded. The brand team will follow up from this request.',
  };
}

export async function GET(request: NextRequest, { params }: { params: { brand: string } }) {
  const profile = getCasperSiteProfile(params.brand);
  if (!profile) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

  const resource = request.nextUrl.searchParams.get('resource') || 'menu';
  if (resource === 'locations') {
    try {
      return response({ ok: true, brand: profile.slug, locations: await getLocations(profile.slug) });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load locations.';
      console.error('Casper brand locations:', message);
      return response({ ok: false, error: 'Locations are temporarily unavailable.' }, 503);
    }
  }

  if (resource !== 'menu') return response({ ok: false, error: 'Unknown resource.' }, 404);
  const target = edgeTarget(profile.slug, 'menu');
  if (!target) return response({ ok: false, error: 'Unknown Casper brand.' }, 404);

  try {
    const upstream = await fetch(target, { cache: 'no-store' });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
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
      const saved = await saveContact(profile.slug, body.payload || {});
      return response(saved.ok ? { ok: true, confirmationCode: saved.confirmationCode, message: saved.message } : { ok: false, error: saved.error }, saved.status);
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
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Casper brand gateway:', error);
    return response({ ok: false, error: 'Request could not be completed.' }, 500);
  }
}
