import * as reactIcons from 'react-icons/bs';
import { IImagePayload, ImagePayload } from '@/components/image';
import { ILinkPayload, LinkPayload } from '@/components/link';
import classNames from 'classnames';
import { SocialLinks } from '@/components/SocialLinks';

import {
  Card as CardComponent,
  CardProps as CardComponentProps,
} from '@/components/card/Card';
import Stronger from '@/components/Stronger';

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
    displaySocialMedia?: boolean;
    cardVariant: CardComponentProps['cardVariant'];
  };
}

export const IntroContent = async ({ data, ...props }: IIntroContent) => {
  const Icon = data.icon
    ? reactIcons[data.icon as keyof typeof reactIcons]
    : null;

  return (
    <CardComponent cardVariant={data.cardVariant} className="container">
      <section className="grid grid-cols-2 gap-y-24 lg:gap-x-24" {...props}>
        <div
          className={classNames(`flex items-center w-full`, {
            'lg:order-1': data.imagePosition === `left`,
            'lg:order-0': data.imagePosition === `right`,
            'col-span-2 lg:col-span-1': data.image,
            'col-span-2 justify-center': !data.image,
          })}
        >
          <div
            className={classNames(`flex flex-col gap-12`, {
              'items-center justify-center': !data.image,
            })}
          >
            {data.title && (
              <div
                className="font-geom text-5xl lg:text-7xl lg:leading-[1.375] max-lg:text-center lg:text-left"
                // dangerouslySetInnerHTML={{ __html: data.title }}
              >
                <Stronger message={data.title} />
              </div>
            )}

            {data.desc && (
              <div
                className={classNames([
                  `text-xl leading-8 max-lg:text-center`,
                  {
                    'text-center lg:max-w-[60rem]': !data.image,
                    'text-left lg:max-w-[28rem]': data.image,
                  },
                ])}
                dangerouslySetInnerHTML={{ __html: data.desc }}
              />
            )}

            {data.link && typeof data.link === `object` && (
              <div className="flex space-x-1 max-lg:items-center max-lg:justify-center">
                <LinkPayload
                  href={data.link}
                  className="bg-glow-green text-black transition hocustive:bg-white hocustive:text-black rounded-lg font-semibold py-3 px-6  disabled:opacity-50 text-lg flex w-fit items-center space-x-2"
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
            <div className="flex max-lg:justify-center">
              {data.displaySocialMedia && <SocialLinks />}
            </div>
          </div>
        </div>

        {data.image && (
          <div
            className={classNames(
              `col-span-2 lg:col-span-1 flex items-center justify-center`,
              {
                'lg:order-0': data.imagePosition === `left`,
                'lg:order-1': data.imagePosition === `right`,
              },
            )}
          >
            {typeof data.image === `object` && (
              <figure className="p-8">
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
    </CardComponent>
  );
};
