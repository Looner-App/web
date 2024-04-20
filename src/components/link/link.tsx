import NextLink, { LinkProps } from 'next/link';

export interface ILink
  extends Omit<LinkProps, 'href'>,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string | null;
}

export const Link = ({ children, href, target, ...props }: ILink) => {
  // Parse plain url domain
  if (
    typeof href == `string` &&
    href[0] != `#` &&
    href[0] != `/` &&
    !href.includes(`http`) &&
    !href.includes(`mailto:`) &&
    !href.includes(`tel:`)
  ) {
    href = `//${href}`;
  }

  return href ? (
    <NextLink href={href} target={target} {...props}>
      {children}
    </NextLink>
  ) : (
    <a target={target} {...props}>
      {children}
    </a>
  );
};
