import { User } from '@/types/payload-types';
import { cookies, headers } from 'next/headers';

export const getUser = async (): Promise<User | null> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set(`referral`, headers().get(`referral`) || ``);

    const path = `/api/users/me?${searchParams.toString()}`;
    const result = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `${path}`, {
      headers: {
        Cookie: cookies().toString(),
      },
      cache: `no-store`,
    });

    const user = await result.json();
    return user || null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
