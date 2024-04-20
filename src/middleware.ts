import { NextResponse, type NextRequest } from 'next/server';
import { getUser } from './libs/api';

export async function middleware(request: NextRequest) {
  const user = await getUser();
  const pathname = request.nextUrl.pathname.split(`/`)[1];

  // Redirect if user access /account
  if (!user && pathname === `account`) {
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = `/login`;

    return NextResponse.redirect(redirectTo.toString());
  }

  // Redirect if user access /claim
  if (!user && pathname === `claim`) {
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = `/login`;
    redirectTo.searchParams.set(
      `redirect`,
      `${process.env.NEXT_PUBLIC_SITE_URL}${request.nextUrl.pathname}`,
    );

    return NextResponse.redirect(redirectTo);
  }

  // Redirect if user already login
  const routeNotLogin = [
    `login`,
    `register`,
    `forgot-password`,
    `reset-password`,
  ];
  if (user && routeNotLogin.includes(pathname)) {
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = `/account`;

    return NextResponse.redirect(redirectTo.toString());
  }

  return NextResponse.next();
}

export const config = {
  // Do not run the middleware on the following paths
  matcher: `/((?!api|_next/static|_next/image|.*\\..*|manifest.json|assets|favicon.ico).*)`,
};
