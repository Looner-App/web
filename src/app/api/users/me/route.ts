import { get } from '@/libs/api';
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookie = cookies();
  const referral =
    request.nextUrl.searchParams.get(`referral`) || headers().get(`x-referral`);

  cookie.set(`x-referral`, referral || ``);

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

  console.log({
    headers: {
      Cookie: cookie.toString(),
    },
  });

  return Response.json(result?.user);
}
