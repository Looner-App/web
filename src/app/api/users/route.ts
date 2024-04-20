import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await fetchPayload(`users`, `POST`, {
    cache: `no-store`,
    headers: { 'Content-Type': `application/json` },
    body: JSON.stringify(body),
  });

  if (result) {
    const data = result.json();
    const status = result.status;

    return Response.json(data, { status });
  }
}

export async function PATCH(request: NextRequest) {
  const { id, ...body } = await request.json();

  let endpoint = `users`;
  if (id) {
    endpoint = `${endpoint}/${id}`;
  }

  const result = await fetchPayload(endpoint, `PATCH`, {
    cache: `no-store`,
    headers: {
      'Content-Type': `application/json`,
      Cookie: cookies().toString(),
    },
    body: JSON.stringify(body),
  });

  if (result) {
    const data = result.json();
    const status = result.status;

    return Response.json(data, { status });
  }
}
