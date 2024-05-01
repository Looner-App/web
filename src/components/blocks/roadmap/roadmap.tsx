'use client';

import { ImagePayload } from '@/components/image';
import { Media } from '@/types/payload-types';
import classnames from 'classnames';

export type RoadmapProps = React.HTMLAttributes<HTMLElement> & {
  data: {
    id?: string | null;
    image?: string | Media | null;
    imageMobile?: string | Media | null;
  };
};

export const Roadmap = ({ className, data, ...props }: RoadmapProps) => {
  return (
    <section
      className={classnames(
        className,
        `container lg:my-10 lg:px-14 text-white`,
      )}
      {...props}
    >
      <div className="max-lg:hidden">
        {data.image && typeof data.image === `object` && (
          <figure>
            <ImagePayload
              src={data.image}
              blur={false}
              unoptimized={true}
              className="w-full"
              size="full"
            />
          </figure>
        )}
      </div>
      <div className="lg:hidden">
        {data.imageMobile && typeof data.imageMobile === `object` && (
          <figure>
            <ImagePayload
              src={data.imageMobile}
              blur={false}
              unoptimized={true}
              className="w-full"
              size="full"
            />
          </figure>
        )}
      </div>
    </section>
  );
};
