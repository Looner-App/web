/**
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: `*`,
      allow: `/`,
      disallow: `/private/`,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
