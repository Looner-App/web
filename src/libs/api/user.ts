import { User } from '@/types/payload-types';

export const getUser = async (): Promise<User | null> => {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/me/`,
    );
    const { user } = await result.json();

    return user;
  } catch (e) {
    console.log(`Error getting user data.`, e);
    return null;
  }
};
