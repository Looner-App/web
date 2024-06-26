import { notFound } from 'next/navigation';
import { getDoc, getDocs, getHomepageSlug } from '@/libs/api';
import { Blocks } from '@/components/blocks';
import { generateMetadataPayload } from '@/libs/helper';

export const dynamic = `force-dynamic`;
interface PageProps {
  params: { slug: string };
}

export default async function Page({ params: { slug } }: PageProps) {
  if (!slug) {
    slug = await getHomepageSlug();
  }

  // Get page data
  const page = await getDoc({ collection: `pages`, slug });

  if (!page || page._status !== `published`) {
    return notFound();
  }

  const { layout } = page;

  return (
    <>
      <Blocks blocks={layout} />
    </>
  );
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  const homepageSlug = await getHomepageSlug();
  const result = await getDocs({ collection: `pages` });

  if (result && result.docs.length > 0) {
    for (const doc of result.docs) {
      if (
        doc.slug &&
        doc.slug !== homepageSlug &&
        doc._status === `published`
      ) {
        slugs.push({ slug: doc.slug });
      }
    }
  }

  return slugs;
}

export async function generateMetadata({ params: { slug } }: PageProps) {
  let isHomepage = false;

  if (!slug) {
    isHomepage = true;
    slug = await getHomepageSlug();
  }

  // Get page data
  const page = await getDoc({ collection: `pages`, slug });

  return page
    ? generateMetadataPayload({
        data: page,
        isHomepage,
      })
    : {};
}
