import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';

export async function GET() {
  let data: any = {
    isLoggedIn: false,
  };

  const isJWTAvailable = cookies().get(`jwt`)?.value;

  if (!isJWTAvailable) {
    return Response.json(
      {
        message: `Unauthorized access`,
        data,
      },
      { status: 401 },
    );
  }

  const result = await fetchPayload(`/users/auth/account`, `GET`, {
    headers: {
      'Content-Type': `application/json`,
      Cookie: cookies().toString(),
    },
  });

  data = await result?.json();

  if (!result || !data?.isLoggedIn) {
    return Response.json(
      {
        message: `Unauthorized access`,
        data,
      },
      { status: 401 },
    );
  }

  return Response.json(
    {
      message: `Success`,
      data,
    },
    {
      status: 200,
    },
  );
}
