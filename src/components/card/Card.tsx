import classNames from 'classnames';
import Image from 'next/image';
import { HTMLProps } from 'react';

export type CardProps = HTMLProps<HTMLDivElement> & {
  cardVariant?: ('default' | 'primary' | 'secondary') | null;
};

export const Card = ({
  children,
  cardVariant = `default`,
  className,
  ...props
}: CardProps) => {
  return (
    <div {...props} className={classNames([className, `relative`])}>
      <div className="static overflow-hidden z-[1]">
        {cardVariant === `primary` && (
          <Image
            src="/card-background.png"
            alt="Card Background"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1024px"
            fill
            className="w-full h-full object-fill object-center container "
            quality={100}
            priority
          />
        )}

        {cardVariant === `secondary` && (
          <Image
            src="/card-background-secondary.png"
            alt="Card Background"
            fill
            className="w-full h-full object-fill object-center "
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1024px"
            quality={100}
            priority
          />
        )}
      </div>
      <div
        className={classNames([
          `relative z-[1]`,
          {
            'p-8 m-8': cardVariant === `primary`,
            'p-px': cardVariant === `secondary`,
          },
        ])}
      >
        {children}
      </div>
    </div>
  );
};
