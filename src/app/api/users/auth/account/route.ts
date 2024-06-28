import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    let data: any = {
      isLoggedIn: false,
    };

    const isJWTAvailable = cookies().get(`thirdweb_frontend`)?.value;

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

    if (!result) {
      return Response.json(
        {
          message: `Unauthorized access`,
          data,
        },
        { status: 401 },
      );
    }

    if (result.status < 200 || result.status >= 300) {
      return Response.json(
        {
          message: `Unauthorized access`,
          data,
        },
        { status: 401 },
      );
    }

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
  } catch (error) {
    console.log(`Error function GET() : /users/me/`);
    console.log(error);

    return Response.json(
      {
        message: `Internal server error`,
        data: {},
      },
      {
        status: 500,
      },
    );
  }
}
