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
  let imageUrl = ``;
  let width = 0;
  let height = 0;

  // Get image props by sizes
  if (typeof src !== `string`) {
    const { sizes, base64, alt: srcAlt } = src;

    if (sizes && size !== `full`) {
      const imageSize = sizes[size];
      if (imageSize) {
        imageUrl = imageSize.url || ``;
        width = imageSize.width || 0;
        height = imageSize.height || 0;
      }
    } else {
      // Fallback to 'large' if size not found or 'full'
      const imageSize = sizes ? sizes[`large`] : undefined;
      if (imageSize) {
        imageUrl = imageSize.url || ``;
        width = imageSize.width || 0;
        height = imageSize.height || 0;
      }
    }

    // Set image placeholder image base64
    if (blur && base64) {
      props.blurDataURL = base64;
      props.placeholder = `blur`;
    }

    // Set alt from payload image data if empty
    if (!alt) alt = srcAlt;

    // Set src url image
    src = imageUrl;
  }

  // Prevent payload deleted images return string ID
  if (typeof src === `string` && src[0] !== `/` && !src.includes(`http`)) {
    src = ``;
  }

  // Set image width & height when no fill
  if (!props.fill && !props.width && !props.height) {
    props.width = width;
    props.height = height;
  }

  return <Image src={src} alt={alt} {...props} />;
};
