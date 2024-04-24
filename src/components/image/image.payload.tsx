import { Image, IImage } from '@/components/image';
import { Media } from '@/types/payload-types';

export interface IImagePayload extends Omit<IImage, 'src'> {
  src: Media | string;
  size?: keyof NonNullable<Media['sizes']> | 'full';
  blur?: boolean;
}

export const ImagePayload = ({
  src,
  alt = ``,
  size = `large`,
  blur = true,
  ...props
}: IImagePayload) => {
  if (typeof src !== `string`) {
    let url = src.url;
    let width = src.width;
    let height = src.height;

    // Get image props by sizes
    switch (size) {
      case `thumbnail`:
        if (src.sizes?.thumbnail?.url) {
          url = src.sizes.thumbnail.url;
        }
        if (src.sizes?.thumbnail?.width) {
          width = src.sizes.thumbnail.width;
        }
        if (src.sizes?.thumbnail?.height) {
          height = src.sizes.thumbnail.height;
        }
        break;
      case `medium`:
        if (src.sizes?.medium?.url) {
          url = src.sizes.medium.url;
        }
        if (src.sizes?.medium?.width) {
          width = src.sizes.medium.width;
        }
        if (src.sizes?.medium?.height) {
          height = src.sizes.medium.height;
        }
        break;
      case `large`:
        if (src.sizes?.large?.url) {
          url = src.sizes.large.url;
        }
        if (src.sizes?.large?.width) {
          width = src.sizes.large.width;
        }
        if (src.sizes?.large?.height) {
          height = src.sizes.large.height;
        }
        break;
    }

    // Set image width & height when no fill
    if (!props.fill && !props.width && !props.height) {
      width && (props.width = width);
      height && (props.height = height);
    }

    // Set image placeholder image base64
    if (blur && src.base64) {
      props.blurDataURL = src.base64;
      props.placeholder = `blur`;
    }

    // Set alt from payload image data if empty
    if (!alt) alt = src.alt;

    // Set src url image
    src = String(url);
  }

  // Prevent payload deleted images return string ID
  if (typeof src === `string` && src[0] !== `/` && !src.includes(`http`)) {
    src = ``;
  }

  return <Image src={src} alt={alt} {...props} />;
};
