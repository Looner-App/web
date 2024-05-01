'use client';

import { ImagePayload } from '@/components/image';
import { Media } from '@/types/payload-types';
import classnames from 'classnames';

export type RoadmapProps = React.HTMLAttributes<HTMLElement> & {
  data: {
    id?: string | null;
    image?: string | Media | null;
    imageMobile?: string | Media | null;
    title?: string | null;
    description?: string | null;
  };
};

export const Roadmap = ({ className, data, ...props }: RoadmapProps) => {
  const { description, title } = data;

  return (
    <section
      className={classnames(
        className,
        `container lg:my-10 lg:px-14 text-white flex flex-col gap-24`,
      )}
      {...props}
    >
      <div className="flex flex-col justify-center items-center gap-12">
        {title && (
          <div
            className="font-cyberbang text-5xl lg:text-7xl leading-normal max-lg:text-center"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {description && (
          <div
            className="text-xl leading-8 text-center lg:max-w-[28rem]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>

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
