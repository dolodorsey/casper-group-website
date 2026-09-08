import { NextResponse } from 'next/server';

const CASPER_SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const WEB_GATEWAY = `${CASPER_SUPABASE_URL}/functions/v1/casper-web-gateway`;
const UPSTREAM_TIMEOUT_MS = 5000;
const CASPER_BRAND_KEY = 'casper_group';

const responseHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

const unavailableResponse = () => NextResponse.json(
  {
    success: false,
    accepted: false,
    error: 'We could not safely record your inquiry. Please try again shortly.',
  },
  {
    status: 503,
    headers: {
      ...responseHeaders,
      'Retry-After': '30',
      'X-Casper-Intake': 'unavailable',
    },
  }
);

const rejectedResponse = (error) => NextResponse.json(
  { success: false, accepted: false, error },
  {
    status: 400,
    headers: {
      ...responseHeaders,
      'X-Casper-Intake': 'rejected',
    },
  }
);

export async function POST(request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return rejectedResponse('Invalid inquiry payload.');
    }

    if (body.brand_key !== CASPER_BRAND_KEY) {
      console.warn('Rejected non-Casper corporate intake identity.');
      return rejectedResponse('Invalid Casper Group inquiry identity.');
    }

    const payload = {
      ...body,
      brand_key: CASPER_BRAND_KEY,
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
        ...responseHeaders,
        'Content-Type': 'application/json; charset=utf-8',
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
