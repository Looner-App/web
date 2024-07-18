import { get } from '@/libs/api';
import { cookies } from 'next/headers';

export async function GET() {
  const cookie = cookies();

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
