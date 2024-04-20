import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.json();

  let message = `Something went wrong`;
  let status = 400;

  const result = await fetchPayload(`/users/login`, `POST`, {
    body: JSON.stringify(formData),
  });

  if (result) {
    const data = await result.json();
    status = result.status;

    if (status >= 200 && status <= 299 && data.token) {
      message = `Login success`;

      // Save cookie login token
      cookies().set(`payload-token`, data.token, {
        httpOnly: true,
        expires: data.exp * 1000,
        path: `/`,
      });
    } else if (!formData.email || !formData.password) {
      message = `Email or password is empty`;
    } else {
      message = data.errors[0].message;
    }
  }

  return Response.json(
    {
      message,
      data: {},
    },
    { status },
  );
}
