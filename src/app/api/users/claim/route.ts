import { cookies } from 'next/headers';
import { fetchPayload, get } from '@/libs/api';

// Define expected types
interface PatchRequestBody {
  id: string;
}

interface UserResponse {
  user: any; // Replace 'any' with the specific user type if available
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const cookie = cookies();
    const { id }: PatchRequestBody = await request.json(); // Extract 'id' from the request body

    // Check if the user is logged in by fetching user data
    const userResult: UserResponse | null = await get(
      `/users/me`,
      {},
      {
        headers: {
          Cookie: cookie.toString(),
        },
        cache: `no-store`,
      },
    );

    // If the user is not logged in, return an error response
    if (!userResult || !userResult.user) {
      return Response.json(
        {
          code: 401,
          message: `User not logged in`,
        },
        {
          status: 401,
        },
      );
    }

    // If user is logged in, send the PATCH request with the provided id
    await fetchPayload(`/custom/claim/${id}`, `PATCH`, {
      headers: {
        Cookie: cookies().toString(),
      },
      cache: `no-store`,
    });

    // Return the user data as a JSON response
    return Response.json({
      code: 200,
      message: `ok`,
    });
  } catch (e) {
    return Response.json(
      {
        code: 400,
        message: `invalid payload`,
      },
      {
        status: 400,
      },
    );
  }
}
