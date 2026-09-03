import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';
const WEB_GATEWAY = `${SUPABASE_URL}/functions/v1/casper-web-gateway`;

export async function GET() {
  try {
    const upstream = await fetch(`${WEB_GATEWAY}?resource=corporate_locations`, { cache: 'no-store' });
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
    console.error('Casper corporate locations gateway:', error);
    return NextResponse.json({ ok: false, error: 'Locations are temporarily unavailable.' }, { status: 503 });
  }
}
