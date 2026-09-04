import { NextResponse } from 'next/server';

const CASPER_SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const WEB_GATEWAY = `${CASPER_SUPABASE_URL}/functions/v1/casper-web-gateway`;
const UPSTREAM_TIMEOUT_MS = 5000;

const unavailableResponse = () => NextResponse.json(
  {
    success: false,
    accepted: false,
    error: 'We could not safely record your inquiry. Please try again shortly.',
  },
  {
    status: 503,
    headers: {
      'Cache-Control': 'no-store',
      'Retry-After': '30',
      'X-Content-Type-Options': 'nosniff',
      'X-Casper-Intake': 'unavailable',
    },
  }
);

export async function POST(request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, accepted: false, error: 'Invalid inquiry payload.' },
        { status: 400, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }
      );
    }

    const payload = {
      ...body,
      sourceUrl: body.sourceUrl || request.headers.get('referer') || null,
      referrer: body.referrer || null,
      idempotencyKey: body.idempotencyKey || request.headers.get('x-idempotency-key') || undefined,
    };

    const upstream = await fetch(WEB_GATEWAY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ action: 'corporate_intake', payload }),
      cache: 'no-store',
      redirect: 'error',
      signal: controller.signal,
    });

    if (upstream.status >= 500) {
      console.error('Casper corporate form gateway unavailable:', upstream.status);
      return unavailableResponse();
    }

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Casper-Intake': upstream.ok ? 'accepted' : 'rejected',
      },
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error('Casper corporate form gateway unavailable:', errorName);
    return unavailableResponse();
  } finally {
    clearTimeout(timeout);
  }
}
