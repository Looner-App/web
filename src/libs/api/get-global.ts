import { Config } from '@/types/payload-types';
import { get } from './payload';

export const getGlobal = async <T extends keyof Config['globals']>({
  slug,
  page,
  locale,
  cache,
}: {
  slug: T;
  page?: number | string | null;
  locale?: string | null;
  cache?: RequestCache;
}): Promise<Config['globals'][T] | null> => {
  const options = cache
    ? { cache }
    : { next: { revalidate: Number(process.env.REVALIDATE_TIMEOUT || 1) } };

  let endpoint = `/globals/${slug}`;
  if (page) {
    endpoint = `${endpoint}/page/${page}`;
  }

  const result = await get(endpoint, { locale }, options);

  return result;
};
