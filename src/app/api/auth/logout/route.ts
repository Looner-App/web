import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';

/// generate payload
export async function GET() {
  const message = `Success`;
  const status = 200;

  await fetchPayload(`/users/auth/logout`, `GET`, {
    headers: {
      'Content-Type': `application/json`,
      Cookie: cookies().toString(),
    },
  });

  cookies().delete(`jwt`);

  return Response.json(
    {
      message,
      data: {},
    },
    { status },
  );
}
