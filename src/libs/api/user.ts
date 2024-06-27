import { User } from '@/types/payload-types';
import { get } from './payload';
import { cookies } from 'next/headers';

export const getUser = async (): Promise<User | null> => {
  // if (typeof window === `undefined` && cookies) {
  const result = await get(
    `/users/me`,
    {},
    {
      headers: cookies
        ? {
            Cookie: cookies().toString(),
          }
        : {},
      cache: `no-store`,
    },
  );

  return result?.user || null;
  // } else {
  //   try {
  //     const result = await fetch(
  //       `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/me/`,
  //     );
  //     const { user } = await result.json();

  //     return user;
  //   } catch (e) {
  //     console.log(`Error getting user data.`, e);
  //     return null;
  //   }
  // }
};
