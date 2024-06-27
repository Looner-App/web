import { Config } from '@/types/payload-types';
import { get } from './payload';

interface PayloadCollections
  extends Omit<
    Config['collections'],
    'payload-preferences' | 'payload-migrations'
  > {}

interface GetDocsType<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export const getDocs = async <T extends keyof PayloadCollections>({
  collection,
  page = 1,
  limit,
  locale,
  variables,
  cache,
}: {
  collection: T;
  page?: number | null;
  limit?: number | null;
  locale?: string | null;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}) => {
  try {
    const getAllDocs = !limit;
    if (getAllDocs) {
      limit = 10;
    }
    const options = cache ? { cache } : undefined;

    const result: GetDocsType<PayloadCollections[T]> | null = await get(
      `/${collection}`,
      {
        limit,
        page,
        locale,
        ...variables,
      },
      options,
    );

    if (result && getAllDocs) {
      for (let i = result.page + 1; i <= result.totalPages; i++) {
        const nextResult: GetDocsType<PayloadCollections[T]> = await get(
          `/${collection}`,
          {
            limit,
            page: i,
            locale,
            ...variables,
          },
          options,
        );

        result.docs = [...result.docs, ...nextResult.docs];
      }
    }

    return result;
  } catch (error) {
    console.log(`Error function getDocs() : ${collection}`);
    console.log(error);
  }
};
