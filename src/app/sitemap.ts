/**
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { getDocs, getHomepageSlug } from '@/libs/api';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const sitemaps: MetadataRoute.Sitemap = [];

  const homepageSlug = await getHomepageSlug();
  const result = await getDocs({ collection: `pages` });

  // Generate sitemap urls for pages
  if (result && result.docs.length > 0) {
    for (const doc of result.docs) {
      // Exclude draft page from sitemap
      if (doc._status !== `published`) continue;

      if (homepageSlug && doc.slug === homepageSlug) {
        // Push homepage to first array
        sitemaps.unshift({
          url: `${siteUrl}`,
          lastModified: doc.updatedAt,
        });
      } else {
        // Push other pages
        sitemaps.push({
          url: `${siteUrl}/${doc.slug}`,
          lastModified: doc.updatedAt,
        });
      }
    }
  }

  return sitemaps;
}
