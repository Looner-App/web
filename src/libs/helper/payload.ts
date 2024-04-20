import { Metadata } from 'next';
import { Page } from '@/types/payload-types';

export const generateMetadataPayload = ({
  data,
  isHomepage = false,
}: {
  data: Page;
  isHomepage?: boolean;
}) => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const slug = data.slug && !isHomepage ? data.slug : ``;
  const path = `${siteUrl}/${slug}`;

  const metaTitle = data.meta?.title || `${data.title} - ${siteName}`;
  const metaDescription = data.meta?.description || ``;
  const metaImage =
    typeof data.meta?.image == `object` ? data.meta.image?.url : null;

  // Init metadata
  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: path,
    },
    icons: `${siteUrl}/favicon.ico`,
    metadataBase: new URL(`${path}`),
  };

  if (metaImage) {
    // Set metadata open graph facebook
    metadata.openGraph = {
      type: `website`,
      url: path,
      title: metaTitle,
      description: metaDescription,
      images: metaImage,
    };

    // Set metadata twitter
    metadata.twitter = {
      title: metaTitle,
      description: metaDescription,
      images: metaImage,
    };
  }

  return metadata;
};
