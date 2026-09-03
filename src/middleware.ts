import { NextRequest, NextResponse } from 'next/server';

const DRIVE_ASSET_REWRITES: Record<string, string> = {
  '/videos/casper-ani.mp4': '/api/media/drive/1qNk8AyjwZfzTbwFV9fJMnVeTMngTlnDf',
  '/images/casper-hero-bg.png': '/api/media/drive/1cwLz3YW2Sl6V55vdzgZLVb1ZwAEMCHdh',
};

export function middleware(request: NextRequest) {
  const replacement = DRIVE_ASSET_REWRITES[request.nextUrl.pathname];
  if (replacement) {
    const url = request.nextUrl.clone();
    url.pathname = replacement;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/videos/casper-ani.mp4', '/images/casper-hero-bg.png'],
};
