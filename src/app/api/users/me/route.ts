import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';

export async function GET() {
  const endpoint = `/users/me`;

  const result = await fetchPayload(endpoint, `GET`, {
    cache: `no-store`,
    headers: {
      'Content-Type': `application/json`,
      Cookie: cookies().toString(),
    },
  });

  if (result) {
    const data = result.json();
    const status = result.status;

    return Response.json(data, { status });
  }
}
