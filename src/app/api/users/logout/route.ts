import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';

export async function POST() {
  await fetchPayload(`/users/logout`, `POST`, {
    headers: {
      'Content-Type': `application/json`,
      Cookie: cookies().toString(),
    },
  });

  cookies().delete(`payload-token`);

  return Response.json({
    message: `Logout success`,
    data: {},
  });
}
