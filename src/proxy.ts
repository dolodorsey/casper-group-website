import { NextRequest, NextResponse } from 'next/server';

const DRIVE_ASSET_REWRITES: Record<string, string> = {
  '/images/casper-hero-bg.png': '/api/media/drive/1cwLz3YW2Sl6V55vdzgZLVb1ZwAEMCHdh',
};

const ENTITY_HOST_ROUTES: Record<string, string> = {
  'americandragon.caspergroupworldwide.com': '/american-dragon',
  'angelwings.caspergroupworldwide.com': '/angel-wings',
  'espressoco.caspergroupworldwide.com': '/espresso-co',
  'mojojuice.caspergroupworldwide.com': '/mojo-juice',
  'morningafter.caspergroupworldwide.com': '/the-morning-after',
  'mroyster.caspergroupworldwide.com': '/mr-oyster',
  'pastabish.caspergroupworldwide.com': '/pasta-bish',
  'pattydaddy.caspergroupworldwide.com': '/patty-daddy',
  'peacepizza.caspergroupworldwide.com': '/peace-pizza',
  'sweettooth.caspergroupworldwide.com': '/sweet-tooth',
  'tacoyaki.caspergroupworldwide.com': '/taco-yaki',
  'tossd.caspergroupworldwide.com': '/tossd',
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = (request.headers.get('host') || '').split(':')[0].toLowerCase();

  const entityRoute = ENTITY_HOST_ROUTES[hostname];
  if (entityRoute && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = entityRoute;
    return NextResponse.rewrite(url);
  }

  // Preserve the longstanding Casper homepage and its motion system.
  // New corporate and concept experiences must layer on top of existing development,
  // never replace or block previously shipped customer-facing features.
  const replacement = DRIVE_ASSET_REWRITES[pathname];
  if (replacement) {
    const url = request.nextUrl.clone();
    url.pathname = replacement;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)', '/images/casper-hero-bg.png'],
};
