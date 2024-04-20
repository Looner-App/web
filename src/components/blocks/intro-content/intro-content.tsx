import { BsFillLightningChargeFill } from 'react-icons/bs';
import { ImagePayload, IImagePayload } from '@/components/image';
import { LinkPayload, ILinkPayload } from '@/components/link';

export interface IIntroContent extends React.HTMLAttributes<HTMLElement> {
  data: {
    title?: string;
    desc?: string;
    link?: ILinkPayload['href'];
    image?: IImagePayload['src'];
    imageCaption?: string;
  };
}

export const IntroContent = ({ data, ...props }: IIntroContent) => {
  return (
    <section className="block-intro-content" {...props}>
      <div className="container my-10 px-14 text-white">
        <div className="md:flex md:space-x-10 md:items-center md:justify-between max-w-[1100px]___ mx-auto space-y-10 md:space-y-0">
          <div className="md:basis-1/2">
            <div className="md:max-w-md">
              {data.title && (
                <div
                  className="rich-text text-2xl md:text-4xl xl:text-6xl leading-normal md:leading-tight xl:leading-tight tracking-wider font-extrabold"
                  dangerouslySetInnerHTML={{ __html: data.title }}
                />
              )}

              {data.desc && (
                <div
                  className="text-sm md:text-2xl mt-4 md:mt-8 md:leading-normal"
                  dangerouslySetInnerHTML={{ __html: data.desc }}
                />
              )}

              {data.link && typeof data.link === `object` && (
                <div className="md:mt-10 mt-5">
                  <LinkPayload
                    href={data.link}
                    className="bg-azure-blue text-white transition hocustive:bg-white hocustive:text-black rounded-lg font-semibold md:py-3 py-2 md:px-6 px-4 disabled:opacity-50 text-sm md:text-lg flex w-fit items-center space-x-2"
                  >
                    <BsFillLightningChargeFill />
                    <span>{data.link.label}</span>
                  </LinkPayload>
                </div>
              )}
            </div>
          </div>

          <div className="md:basis-1/2">
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
        </div>
      </div>
    </section>
  );
};
