import { type NextRequest, NextResponse } from 'next/server';
import { getUser } from './libs/api';

const withoutMenus = [`augmented`, `claim`];

export async function middleware(request: NextRequest) {
  const user = await getUser();
  const pathname = request.nextUrl.pathname.split(`/`)[1];
  const headers = new Headers(request.headers);
  const pathSegments = request.nextUrl.pathname.split(`/`);
  const firstPath = pathSegments[1];
  const use_menu = String(!withoutMenus.includes(firstPath) ? 1 : 0);
  headers.set(`x-use-menu`, use_menu);
  if (firstPath === `claim`) {
    headers.set(`x-is-claim`, `1`);
    headers.set(`x-remove-min-h`, `1`);
  } else {
    headers.set(`x-is-claim`, `0`);
    headers.set(`x-remove-min-h`, `0`);
  }
  // Redirect if user access /account
  if (!user && pathname === `account`) {
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = `/`;

    return NextResponse.redirect(redirectTo.toString());
  }

  // Redirect if user access /claim
  if (!user && pathname === `claim`) {
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = `/`;
    redirectTo.searchParams.set(
      `redirect`,
      `${process.env.NEXT_PUBLIC_SITE_URL}${request.nextUrl.pathname}`,
    );

    return NextResponse.redirect(redirectTo);
  }

  // Redirect if user access /augmented
  if (!user && pathname === `augmented`) {
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = `/`;
    redirectTo.searchParams.set(
      `redirect`,
      `${process.env.NEXT_PUBLIC_SITE_URL}${request.nextUrl.pathname}`,
    );

    return NextResponse.redirect(redirectTo);
  }

  // Redirect if user already login
  const routeNotLogin = [
    ///todo: remove old paths
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

  return NextResponse.next({ headers });
}

export const config = {
  // Do not run the middleware on the following paths
  matcher: `/((?!api|_next/static|_next/image|.*\\..*|manifest.json|assets|favicon.ico).*)`,
};
