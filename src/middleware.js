import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/admin/login';
  const sessionCookie = request.cookies.get('admin_session');

  if (path.startsWith('/admin') && !isPublicPath && !sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
  }

  if (isPublicPath && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
