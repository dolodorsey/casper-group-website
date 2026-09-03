import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';

export async function GET() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ ok: false, error: 'Location data service is not configured.' }, { status: 503 });
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cg_locations?status=eq.open&select=id,name,address,city,state,kitchen_hours,delivery_platforms,status&order=name.asc`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) throw new Error(`Location read failed (${res.status}).`);
    return NextResponse.json(
      { ok: true, locations: await res.json() },
      { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }
    );
  } catch (error) {
    console.error('Casper corporate locations:', error);
    return NextResponse.json({ ok: false, error: 'Locations are temporarily unavailable.' }, { status: 503 });
  }
}
