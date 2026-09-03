import { NextResponse } from 'next/server';

const CASPER_SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const WEB_GATEWAY = `${CASPER_SUPABASE_URL}/functions/v1/casper-web-gateway`;

export async function POST(request) {
  try {
    const body = await request.json();
    const payload = {
      ...body,
      sourceUrl: body.sourceUrl || request.headers.get('referer') || null,
      referrer: body.referrer || null,
      idempotencyKey: body.idempotencyKey || request.headers.get('x-idempotency-key') || undefined,
    };

    const upstream = await fetch(WEB_GATEWAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'corporate_intake', payload }),
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
    console.error('Casper corporate form gateway:', error);
    return NextResponse.json(
      { success: false, accepted: false, error: 'We could not safely record your inquiry. Please try again.' },
      { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }
    );
  }
}
