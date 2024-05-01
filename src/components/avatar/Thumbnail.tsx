import { User } from '@/types/payload-types';
import classNames from 'classnames';
import Image, { ImageProps } from 'next/image';

export type AvatarThumbnailProps = Partial<ImageProps> & {
  user?: User | null;
};

export const AvatarThumbnail = ({
  user,
  width = 32,
  height = 32,
  className,
  ...props
}: AvatarThumbnailProps) => (
  <Image
    {...props}
    width={width}
    height={height}
    src={`https://robohash.org/${user?.id}`}
    alt={user?.name || `User`}
    className={classNames(
      className,
      `overflow-hidden max-w-[70px] md:max-w-none mx-auto bg-black`,
      {
        'rounded-lg': !className?.includes(`rounded-`),
      },
    )}
    priority
  />
);

export default AvatarThumbnail;
