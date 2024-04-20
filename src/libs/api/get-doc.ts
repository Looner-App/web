import { Config } from '@/types/payload-types';
import { get } from './payload';

interface PayloadCollections
  extends Omit<
    Config['collections'],
    'payload-preferences' | 'payload-migrations'
  > {}

export const getDoc = async <T extends keyof PayloadCollections>({
  collection,
  slug,
  locale,
  cache,
}: {
  collection: T;
  slug: string;
  locale?: string | null;
  cache?: RequestCache;
}): Promise<PayloadCollections[T] | null> => {
  const options = cache
    ? { cache }
    : { next: { revalidate: Number(process.env.REVALIDATE_TIMEOUT || 1) } };

  const result = await get(
    `/${collection}`,
    {
      locale,
      where: {
        slug: {
          equals: slug,
        },
      },
    },
    options,
  );

  return result && result.totalDocs > 0 ? result.docs[0] : null;
};
