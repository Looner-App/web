import * as reactIcons from 'react-icons/bs';
import { ImagePayload, IImagePayload } from '@/components/image';
import { LinkPayload, ILinkPayload } from '@/components/link';
import classNames from 'classnames';

export interface IIntroContent extends React.HTMLAttributes<HTMLElement> {
  data: {
    title?: string;
    desc?: string;
    link?: ILinkPayload['href'];
    image?: IImagePayload['src'];
    imageCaption?: string;
    imagePosition?: 'left' | 'right';
    displayIcon: boolean;
    icon?: string | null;
    iconPosition?: ('left' | 'right') | null;
  };
}

export const IntroContent = ({ data, ...props }: IIntroContent) => {
  const Icon = data.icon
    ? reactIcons[data.icon as keyof typeof reactIcons]
    : null;

  return (
    <section className="container grid grid-cols-2 gap-24" {...props}>
      <div
        className={classNames(`flex items-center`, {
          'order-1': data.imagePosition === `left`,
          'order-0': data.imagePosition === `right`,
          'col-span-2 lg:col-span-1': data.image,
          'col-span-2': !data.image,
        })}
      >
        <div
          className={classNames(`flex flex-col gap-12`, {
            'items-center justify-center': !data.image,
          })}
        >
          {data.title && (
            <div
              className="font-cyberbang text-7xl leading-normal"
              dangerouslySetInnerHTML={{ __html: data.title }}
            />
          )}

          {data.desc && (
            <div
              className="text-xl leading-8"
              dangerouslySetInnerHTML={{ __html: data.desc }}
            />
          )}

          {data.link && typeof data.link === `object` && (
            <div className="flex space-x-1">
              <LinkPayload
                href={data.link}
                className="bg-azure-blue text-white transition hocustive:bg-white hocustive:text-black rounded-lg font-semibold md:py-3 py-2 md:px-6 px-4 disabled:opacity-50 text-sm md:text-lg flex w-fit items-center space-x-2"
              >
                {data.displayIcon && Icon && (
                  <Icon
                    className={classNames({
                      'order-0': data.iconPosition === `left`,
                      'order-1': data.iconPosition === `right`,
                    })}
                  />
                )}

                {data.link.label && (
                  <span
                    className={classNames({
                      'order-1': data.iconPosition === `left`,
                      'order-0': data.iconPosition === `right`,
                    })}
                  >
                    {data.link.label}
                  </span>
                )}
              </LinkPayload>
            </div>
          )}
        </div>
      </div>

      {data.image && (
        <div
          className={classNames(`col-span-2 lg:col-span-1 flex items-center`, {
            'order-0': data.imagePosition === `left`,
            'order-1': data.imagePosition === `right`,
          })}
        >
          {typeof data.image === `object` && (
            <figure>
              <ImagePayload
                src={data.image}
                blur={false}
                unoptimized={true}
                className="w-full"
                size="full"
              />

              {data.imageCaption && (
                <figcaption
                  className="text-center font-neometric-alt md:text-2xl uppercase mt-4 [&_strong]:font-black [&_b]:font-black"
                  dangerouslySetInnerHTML={{ __html: data.imageCaption }}
                />
              )}
            </figure>
          )}
        </div>
      )}
    </section>
  );
};
