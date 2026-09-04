import { NextRequest, NextResponse } from 'next/server';

const DRIVE_ASSET_REWRITES: Record<string, string> = {
  '/images/casper-hero-bg.png': '/api/media/drive/1cwLz3YW2Sl6V55vdzgZLVb1ZwAEMCHdh',
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Corporate homepage uses the 2026 static/portal experience. Legacy Casper motion is blocked.
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/corporate';
    return NextResponse.rewrite(url);
  }

  if (pathname === '/videos/casper-ani.mp4') {
    return new NextResponse(null, { status: 410 });
  }

  const replacement = DRIVE_ASSET_REWRITES[pathname];
  if (replacement) {
    const url = request.nextUrl.clone();
    url.pathname = replacement;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/videos/casper-ani.mp4', '/images/casper-hero-bg.png'],
};
