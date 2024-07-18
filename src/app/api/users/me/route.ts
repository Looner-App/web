import { get } from '@/libs/api';
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookie = cookies();

  /// todo: double chec if necessary getting this way
  const referral =
    cookie.get(`referral`)?.value ||
    headers().get(`referral`) ||
    request.nextUrl.searchParams.get(`referral`);

  if (referral) {
    cookie.set({
      name: `referral`,
      value: String(referral),
      httpOnly: false,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: `/`,
    });
  }

  const result = await get(
    `/users/me`,
    {},
    {
      headers: {
        Cookie: cookie.toString(),
      },
      cache: `no-store`,
    },
  );

  return Response.json(result?.user);
}
