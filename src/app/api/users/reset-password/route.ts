import { fetchPayload } from '@/libs/api';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.json();

  let message = `Something went wrong`;
  let status = 400;

  if (!formData.password || !formData.confirmPassword) {
    message = `Password or confirm password is empty`;
  } else if (formData.password !== formData.confirmPassword) {
    message = `Confirm password doesn't match`;
  } else {
    const result = await fetchPayload(`/users/reset-password`, `POST`, {
      body: JSON.stringify(formData),
    });

    if (result) {
      status = result.status;

      if (status >= 200 && status <= 299) {
        message = `Password reset success`;
      } else {
        message = `Reset link expired`;
      }
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
