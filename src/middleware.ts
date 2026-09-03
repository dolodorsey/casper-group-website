import { NextRequest, NextResponse } from 'next/server';

const CASPER_GROUP_HERO = '/api/media/drive/1qNk8AyjwZfzTbwFV9fJMnVeTMngTlnDf';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/videos/casper-ani.mp4') {
    const url = request.nextUrl.clone();
    url.pathname = CASPER_GROUP_HERO;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/videos/casper-ani.mp4'],
};
