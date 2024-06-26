import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';

export async function GET() {
  const result = await fetchPayload(`/users/me/`, `GET`, {
    cache: `no-store`,
    headers: {
      'Content-Type': `application/json`,
      Cookie: cookies().toString(),
    },
  });

  return Response.json(await result?.json());
}
