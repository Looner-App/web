'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { LinkPayload } from '@/components/link';
import { mergeStyle } from '@/libs/helper';

export interface IMenuItem extends React.LiHTMLAttributes<HTMLLIElement> {
  href: string;
  segment?: string | null;
}

export const MenuItem = ({ href, segment, children, ...props }: IMenuItem) => {
  const activeSegment = useSelectedLayoutSegment();

  return (
    <li {...props}>
      <LinkPayload
        href={href}
        className={mergeStyle(
          `after:bg-white after:absolute after:h-px after:-bottom-1 after:left-1/2 after:-translate-x-1/2 relative after:transition-[width] after:duration-300 after:w-0 hocustive:after:w-full`,
          segment == activeSegment && `after:w-full`,
        )}
      >
        {children}
      </LinkPayload>
    </li>
  );
};
