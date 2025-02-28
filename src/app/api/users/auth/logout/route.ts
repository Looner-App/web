import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';

/// generate payload
export async function POST() {
  await fetchPayload(`/users/logout`, `POST`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });

  cookies().delete(`thirdweb_frontend`);

  return Response.json({ message: `Success` });
}
