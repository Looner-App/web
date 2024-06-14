import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';

/// generate payload
export async function POST() {
  await fetchPayload(`/users/logout`, `POST`, {
    headers: {
      'Content-Type': `application/json`,
      Cookie: cookies().toString(),
    },
  });

  cookies().delete(`jwt`);

  return Response.json(
    { message: `Success` },
    {
      status: 200,
    },
  );
}
