import { User } from '@/types/payload-types';
import { get } from './payload';
import { cookies } from 'next/headers';

async function getCookieData() {
  const cookieData = cookies().toString();
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData);
    }, 1000),
  );
}

export const getUser = async (): Promise<User | null> => {
  try {
    const cookies = await getCookieData();
    const result = await get(
      `/users/me`,
      {},
      {
        headers: {
          Cookie: cookies as string,
        },
        cache: `no-store`,
      },
    );

    return result?.user || null;
  } catch (e) {
    console.log(`Error getting user data.`, e);
    return null;
  }
};
