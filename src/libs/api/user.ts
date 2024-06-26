import { User } from '@/types/payload-types';
import { get } from './payload';
import { cookies } from 'next/headers';

export const getUser = async (): Promise<User | null> => {
  try {
    const result = await get(
      `/users/me`,
      {},
      {
        headers: {
          Cookie: cookies().toString(),
        },
        cache: `no-store`,
      },
    );

    return result?.user || null;
  } catch {
    console.log(`Error getting user data.`);
    return null;
  }
};
