import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_DRIVE_MEDIA = new Set([
  // Brand animations
  '1V25uOjLKns4L_CsIojnlakPrV8L8sTY6', // Angel Wings ANI2
  '1THO-QL2tgwvKyGgJElTIqObLSME836Fm', // Angel + Mascot ANI2
  '1o7dtk3fpPqsaVYKAqkhZ2Jcbpne_P2YB', // Morning After
  '1KiYD9D0I2O6ZLrtYV3xkiF1RvsuXhWmo', // Patty Daddy
  '1ipuuxn9Oem8EezABsfiSkOhuDQ77y7_E', // Espresso
  '10Gaduvuzb8wxuxfUhr_0u638-SHZihmx', // Mojo
  '1mg0svDReyPM0mpcxnrF7-opxKMftygvL', // Mr Oyster
  '1KjCPso-XE0KUTzqNCLFJtrbAF5971kDk', // Sweet Tooth
  '1FOz7i7bMHl2WRECMxVretfGaYPF657AG', // Taco Yaki
  '18SDp95ZVyAftd55R4zG2gwxd-EC4J4O8', // Tossd
  '1th39hcfT-smuvF4GCeju70tFuGpBfZxK', // Pasta Bish
  '1_PhppyhAo7ezAwHISk26u8F_juhdBQDr', // Peace Pizza
  '15q_Ofxf_Khl3lErxVbbCNcn9NMxBbjaI', // American Dragon
  '1qNk8AyjwZfzTbwFV9fJMnVeTMngTlnDf', // Casper Group

  // Angel Wings graphics
  '1yICMDAcyzC9Er5o1B99kmG0OqwGkvh7Z',
  '1HwanqSmzyDXBxdvYSnngIpQJNDa_C-lc',
  '1_1oz3EyYJ01qzIgQLvVBcDq__IsF0HJ7',

  // Espresso graphics
  '1_qafmRb8HnjycpCYZ8owwNOZ9dB4AoDg',
  '1TVeu5og1YDWrz9yDxsnzHWncfwqQJKVW',
  '1sUqswa5ZiE6xLdNCJR9c7FI-h7c3E7HP',

  // Mojo graphics
  '1wMBHI5-xnZ41SxA7a4vLOiVfhG9Ncybv',
  '1QNG8F6U0O6pFYhiTrOGpxpebhQqdBiqd',
  '1bqntIh0GW3xpud0-llds6VW1dm_Y8ZTm',

  // Mr Oyster graphics
  '1BdPSH3UUW139zBfcVYohBVXsPQRr4o_x',
  '1QY8JL4kR4io6Joaww4ttPhbx6sKmDYHl',
  '1-LJw0dOiP5g1SMP0F3XuRsCM2SuM-V19',

  // Sweet Tooth graphics
  '1csLrgQIVpbxyeLSC11rSuPfAfdUiAewR',
  '1hh3Z9ww4USs72vjslax6KEUEyKrkR6Hu',
  '1ZI2XC2YtmNF8sQWYYxQ06wMlxW2gmvaT',

  // Taco Yaki graphics
  '1VujWrnb5M0RxKjFFBpcbE_RVlvjbw-T2',
  '1zJdTniHvV079VO4Z4VgSMpatIKe-LFLk',
  '1TU9NtsKp2X8kzi5AVcXrFOfIHXZXEVSW',

  // Tossd graphics
  '1cTKrc-cMqZ-IJHXAllAWL5YCC538aUwv',
  '1xdMvL2hoUnpYpXQ_2dD6NIGO4zwu8DTV',
  '1K7JyX3dOI2eVlHjGk9AWm64mKSGIJ5Im',

  // Pasta Bish graphics
  '1z1DyOlro8Zg5foX2FDVKzq3Z26Bzx-Cy',
  '1M4SsHXK3uDJgIU2t66Y5_9sOBKAboVjh',
  '1FXAzToY1VG46D9O3hDN2CRKtWED0nfpt',

  // Peace Pizza graphics
  '1wk28ZOfO-43WK7EQX2ZvyqvbclK4jg8N',
  '1rDNq7uPVc7iQqKpaPgky4WCI8h6EWlWZ',
  '1FtEkoffLwxgPz87wBvoOFzzyg-UxU2ux',

  // American Dragon graphics
  '1gwefS0XW6EkYfMARut8zxWg-ZjXgCLHc',
  '1xd7dcc-Tdw__vqNoGvrRM7wT-t1PUcL6',
  '1oPQHK_G2OHm-vDFH3ZWsJc-Hyhbr6dOs',
]);

const COPY_HEADERS = [
  'content-type',
  'content-length',
  'content-range',
  'accept-ranges',
  'etag',
  'last-modified',
] as const;

function upstreamHeaders(request: NextRequest) {
  const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 CasperGroupMedia/1.0',
  });
  for (const name of ['range', 'if-none-match', 'if-modified-since']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
}

async function fetchDriveAsset(id: string, request: NextRequest) {
  const headers = upstreamHeaders(request);
  const urls = [
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&authuser=0&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}&confirm=t`,
  ];

  let lastResponse: Response | null = null;
  for (const url of urls) {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      redirect: 'follow',
      cache: 'no-store',
    });
    lastResponse = response;
    const type = response.headers.get('content-type') || '';
    if (response.ok && !type.includes('text/html')) return response;
  }
  return lastResponse;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!ALLOWED_DRIVE_MEDIA.has(id)) {
    return Response.json({ error: 'Media asset not allowed.' }, { status: 404 });
  }

  try {
    const upstream = await fetchDriveAsset(id, request);
    if (!upstream || (!upstream.ok && upstream.status !== 206 && upstream.status !== 304)) {
      return Response.json({ error: 'Media asset unavailable.' }, { status: 502 });
    }

    const headers = new Headers();
    for (const name of COPY_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');
    headers.set('Content-Disposition', 'inline');
    headers.set('X-Content-Type-Options', 'nosniff');

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  } catch (error) {
    console.error('Casper Drive media proxy failed', { id, error });
    return Response.json({ error: 'Media asset unavailable.' }, { status: 502 });
  }
}
