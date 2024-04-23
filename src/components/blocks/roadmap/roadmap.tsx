'use client';

import { ImagePayload } from '@/components/image';
import { Media } from '@/types/payload-types';
import classnames from 'classnames';

export type RoadmapProps = React.HTMLAttributes<HTMLElement> & {
  data: {
    id?: string | null;
    image: string | Media;
    imageMobile: string | Media;
  };
};

export const Roadmap = ({ className, data, ...props }: RoadmapProps) => {
  return (
    <section
      className={classnames(className, `container my-10 px-14 text-white`)}
      {...props}
    >
      <div className="max-lg:hidden">
        {typeof data.image === `object` && (
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
        {typeof data.image === `object` && (
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
