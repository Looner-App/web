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
            fill
            className="w-full h-full object-fill object-center container"
          />
        )}
      </div>
      <div
        className={classNames([
          `relative z-[1]`,
          {
            'p-8 m-8': cardVariant === `primary`,
          },
        ])}
      >
        {children}
      </div>
    </div>
  );
};