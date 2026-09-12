import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_DRIVE_MEDIA = new Set([
  '1V25uOjLKns4L_CsIojnlakPrV8L8sTY6','1MD79M4KjdAe_vr4D2SK5hdd0MVpOlnRD','1THO-QL2tgwvKyGgJElTIqObLSME836Fm','1o7dtk3fpPqsaVYKAqkhZ2Jcbpne_P2YB','1KiYD9D0I2O6ZLrtYV3xkiF1RvsuXhWmo','1ipuuxn9Oem8EezABsfiSkOhuDQ77y7_E','1aBmFWUJ4eFPGFZp5kUU6jsBVpLUUdJPK','10Gaduvuzb8wxuxfUhr_0u638-SHZihmx','1mg0svDReyPM0mpcxnrF7-opxKMftygvL','1KjCPso-XE0KUTzqNCLFJtrbAF5971kDk','1FOz7i7bMHl2WRECMxVretfGaYPF657AG','18SDp95ZVyAftd55R4zG2gwxd-EC4J4O8','1th39hcfT-smuvF4GCeju70tFuGpBfZxK','1SxjkEl25QUsUYy8msWiU1MbhzV3uNcWu','1_PhppyhAo7ezAwHISk26u8F_juhdBQDr','1BtFGByA-rYxZCcb1SUz1L701lEEIBOml','15q_Ofxf_Khl3lErxVbbCNcn9NMxBbjaI','1qNk8AyjwZfzTbwFV9fJMnVeTMngTlnDf',
  '1gJiMLlqRDc_AJKS-PYcvTJ0Fx9d-WR8Y','1lFpOiklEfS74Jz_meTEw-1Qb6uhai-bM','1gPgAxM8aO7p3FmLHDZ0QUvQCftG7ofJ1','1JcskswWYKwgF6JudT6jjA95nVm3CQG22','1g6gL48VTB_ENxjHWqJflfl2JZjanM9OW','1SM62KxJCCUOdt2I5usgX2JMgUNkOcbxq','1m5ZukRzFyjGhHELq6H-sryO4PdRSP8-s','1WGvE6Jl_sMogvbeKKueFu9NrsEmv_bg0','1H3774fi3Z8qoEmAm9S-Vo1alVjNq7r9o','1oOJ6bE_B1tbZaYTPAeCJ8M54iHIUXfmK',
  '1cwLz3YW2Sl6V55vdzgZLVb1ZwAEMCHdh',
  '1yICMDAcyzC9Er5o1B99kmG0OqwGkvh7Z','1HwanqSmzyDXBxdvYSnngIpQJNDa_C-lc','1_1oz3EyYJ01qzIgQLvVBcDq__IsF0HJ7','1uVh4F0G56A-Q3n0l9ib2liV7VDXd8xs-','11Af9xIhyFG6aHpg-gPM3FJJtPHy9pD-X','12YANAf_KCXD1dg1lSus40gIYCtJQ0DbC','1bXaVog9fL5wO5gg6c2myI25QQqHStfoS',
  '1ICwpewyTAXp7kAeEOkUTedglm81yI9it','15xZ2qw-tIQ2_fjY3vk8HRMcZkltEQAzV','17xqYXkV4M8b4BVqLkyZV7P2e_j244EPe',
  '1BwfhCwAjTzQ_Eszg94L3WYfriO8OKVlH','1l4xG1N0lkwKoXKlWeWChFKCBIA6BQro8','1RK6YUSSidyIgON6TR2unEAYgnx_8-Okq','1mFtjN9ByHsqkIOPaovwSgNhbPdIgVkpl',
  '1_qafmRb8HnjycpCYZ8owwNOZ9dB4AoDg','1TVeu5og1YDWrz9yDxsnzHWncfwqQJKVW','1sUqswa5ZiE6xLdNCJR9c7FI-h7c3E7HP','1545tK6BbikyBeafmmAnuKmpa67DsMe76','1T6Na4cX6qrrr07ZS_I2bn9vRcufD96B4','1RwJstvLEtOIEgFvmDAwBZk3JTZNaBZlK','1ziiFgFI7tCBaNuXVejfz9vpnI3dtiC0k',
  '1wMBHI5-xnZ41SxA7a4vLOiVfhG9Ncybv','1QNG8F6U0O6pFYhiTrOGpxpebhQqdBiqd','1bqntIh0GW3xpud0-llds6VW1dm_Y8ZTm','1b5nwhWjXuuLx5eOg67R-meYQV8QceJ1W','1AGsyDnQSHtXIaRACmeoRcke-secy3yGN','1SOzb74TwmcvW8vVjtZ9ouXlgfQpYb2Jb','17bmvrSubOrqxDXe6hhD7GmDkpuN6b6sU',
  '1BdPSH3UUW139zBfcVYohBVXsPQRr4o_x','1QY8JL4kR4io6Joaww4ttPhbx6sKmDYHl','1-LJw0dOiP5g1SMP0F3XuRsCM2SuM-V19',
  '1csLrgQIVpbxyeLSC11rSuPfAfdUiAewR','1hh3Z9ww4USs72vjslax6KEUEyKrkR6Hu','1ZI2XC2YtmNF8sQWYYxQ06wMlxW2gmvaT','1tBeHx7LT5Kc-wBuF-n3_P6FxUCjWwpWK','1tA1I2tTKmr0bEAzYDkYKUsDxsGJ64gjh','1V451MLUY6WUHY4__Qvfoqk8XBRbhdakz','1vEG2Oc_90Gn--y0YaKJ3kEhVzlfTHxfr',
  '1VujWrnb5M0RxKjFFBpcbE_RVlvjbw-T2','1zJdTniHvV079VO4Z4VgSMpatIKe-LFLk','1TU9NtsKp2X8kzi5AVcXrFOfIHXZXEVSW',
  '1cTKrc-cMqZ-IJHXAllAWL5YCC538aUwv','1xdMvL2hoUnpYpXQ_2dD6NIGO4zwu8DTV','1K7JyX3dOI2eVlHjGk9AWm64mKSGIJ5Im',
  '1z1DyOlro8Zg5foX2FDVKzq3Z26Bzx-Cy','1M4SsHXK3uDJgIU2t66Y5_9sOBKAboVjh','1FXAzToY1VG46D9O3hDN2CRKtWED0nfpt',
  '1wk28ZOfO-43WK7EQX2ZvyqvbclK4jg8N','1rDNq7uPVc7iQqKpaPgky4WCI8h6EWlWZ','1FtEkoffLwxgPz87wBvoOFzzyg-UxU2ux',
  '1gwefS0XW6EkYfMARut8zxWg-ZjXgCLHc','1xd7dcc-Tdw__vqNoGvrRM7wT-t1PUcL6','1oPQHK_G2OHm-vDFH3ZWsJc-Hyhbr6dOs',
]);

const COPY_HEADERS = ['content-type','content-length','content-range','accept-ranges','etag','last-modified'] as const;

function upstreamHeaders(request: NextRequest) {
  const headers = new Headers({ 'User-Agent': 'Mozilla/5.0 CasperGroupMedia/1.0' });
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
    const response = await fetch(url, { method: 'GET', headers, redirect: 'follow', cache: 'no-store' });
    lastResponse = response;
    const type = response.headers.get('content-type') || '';
    if (response.ok && !type.includes('text/html')) return response;
  }
  return lastResponse;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!ALLOWED_DRIVE_MEDIA.has(id)) return Response.json({ error: 'Media asset not allowed.' }, { status: 404 });

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
    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
  } catch (error) {
    console.error('Casper Drive media proxy failed', { id, error });
    return Response.json({ error: 'Media asset unavailable.' }, { status: 502 });
  }
}
