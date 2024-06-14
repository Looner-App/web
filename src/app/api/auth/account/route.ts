import { fetchPayload, getUser } from '@/libs/api';
import { cookies } from 'next/headers';

/// generate payload
export async function GET() {
  let message = `Something went wrong`;
  let status = 400;

  const isJWTAvailable = cookies().get(`jwt`)?.value;

  if (!isJWTAvailable) {
    message = `Unauthorized access`;
    return Response.json(
      {
        message,
        data: {},
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

  const user = await getUser();
  console.log(`user`, user);

  let data: any = {};

  if (result) {
    data = await result.json();
    status = result.status;

    if (status >= 200 && status <= 299) {
      message = `Success`;
    } else {
      message = data.errors[0].message;
    }
  }

  return Response.json(
    {
      message,
      data,
    },
    { status },
  );
}
