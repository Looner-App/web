import { fetchPayload } from '@/libs/api';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.json();

  let message = `Something went wrong`;
  let status = 400;

  const result = await fetchPayload(`/users/register`, `POST`, {
    body: JSON.stringify(formData),
  });

  if (result) {
    const data = await result.json();
    status = result.status;

    if (status >= 200 && status <= 299) {
      message = `Register success`;
    } else if (data.errors[0].name === `ValidationError`) {
      message = data.errors[0].data[0].message;
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
