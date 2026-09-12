import { NextRequest, NextResponse } from 'next/server';

const DRIVE_ASSET_REWRITES: Record<string, string> = {
  '/images/casper-hero-bg.png': '/api/media/drive/1cwLz3YW2Sl6V55vdzgZLVb1ZwAEMCHdh',
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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
  matcher: ['/images/casper-hero-bg.png'],
};
