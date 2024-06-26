import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

/// generate payload
export async function GET(request: NextRequest) {
  let message = `Something went wrong`;
  let status = 400;

  const query = new URL(request.url).searchParams;
  const address = query.get(`address`);

  if (!address) {
    message = `Unauthorized access`;
    return Response.json(
      {
        message,
        data: {},
      },
      { status },
    );
  }

  const result = await fetchPayload(
    `/users/auth?address=${query.get(`address`)}`,
    `GET`,
  );

  let data: any = {};

  if (result) {
    data = await result.json();
    status = result.status;

    if (status >= 200 && status <= 299) {
      message = `Login success`;
    } else {
      message = data?.errors?.[0]?.message || message;
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

export async function POST(request: NextRequest) {
  let message = `Something went wrong`;
  let status = 400;

  const payload = await request.json();
  const result = await fetchPayload(`/users/auth`, `POST`, {
    body: JSON.stringify(payload),
  });

  let data: any = {};

  if (result) {
    data = await result.json();
    status = result.status;

    if (status >= 200 && status <= 299 && data.token) {
      message = `Login success`;

      // Save cookie login token
      cookies().set(`jwt`, data.token, {
        httpOnly: true,
        expires: data.exp * 1000,
        path: `/`,
      });
    } else {
      message = data?.errors?.[0]?.message || message;
    }
  }

  return Response.json(
    {
      message,
      data,
    },
    {
      status,
    },
  );
}
