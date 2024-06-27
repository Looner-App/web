import { Page } from '@/types/payload-types';
import { ILink, Link } from './link';

interface PayloadLinkObject {
  type?: 'reference' | 'archive' | 'custom' | 'link' | null;
  newTab?: boolean | null;
  reference?: {
    relationTo: 'pages';
    value: string | Page;
  } | null;
  archive?: string | null;
  url?: string | null;
  label?: string;
}

export interface ILinkPayload
  extends Omit<ILink, 'href'>,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: PayloadLinkObject | string | null;
}

export const LinkPayload = ({
  children,
  href,
  target,
  ...props
}: ILinkPayload) => {
  // Set href by payloadcms link object
  if (href && typeof href == `object`) {
    const data = href;

    href = ``;
    target = data.newTab ? `_blank` : undefined;

    switch (data.type) {
      case `reference`:
        if (!data.reference) break;
        if (typeof data.reference.value != `object`) break;

        const slug = data.reference.value.slug || ``;

        href = `/${slug}`;

        break;
      case `archive`:
        if (!data.archive) break;

        href = `/${data.archive}`;

        break;
      case `custom` || `link`:
        if (!data.url) break;

        href = data.url;

        break;
    }

    if (!children) {
      children = data.label;
    }

    if (data.type === `link`) {
      return (
        <a href={String(data?.url ?? `/`)} target={target} {...props}>
          {children}
        </a>
      );
    }
  }

  return (
    <Link href={href} target={target} {...props}>
      {children}
    </Link>
  );
};
