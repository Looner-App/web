import NextImage, { ImageProps } from 'next/image';

export interface IImage extends Omit<ImageProps, 'alt'> {
  alt?: string;
}

export const Image = ({ src, alt = ``, ...props }: IImage) => {
  return <NextImage src={src} alt={alt} {...props} />;
};
