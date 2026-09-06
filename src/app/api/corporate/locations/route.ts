import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const WEB_GATEWAY = `${SUPABASE_URL}/functions/v1/casper-web-gateway`;
const UPSTREAM_TIMEOUT_MS = 5000;

function unavailableResponse() {
  return NextResponse.json(
    { ok: false, available: false, error: 'Locations are temporarily unavailable.' },
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': '30',
        'X-Content-Type-Options': 'nosniff',
        'X-Casper-Data': 'unavailable',
      },
    }
  );
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(`${WEB_GATEWAY}?resource=corporate_locations`, {
      cache: 'no-store',
      redirect: 'error',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (upstream.status >= 500) {
      console.error('Casper corporate locations gateway unavailable:', upstream.status);
      return unavailableResponse();
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
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error('Casper corporate locations gateway unavailable:', errorName);
    return unavailableResponse();
  } finally {
    clearTimeout(timeout);
  }
}
