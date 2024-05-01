'use client';

import classNames from 'classnames';

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  title: string;
  description: string;
};

export const Card = ({
  title,
  className,
  description,
  ...props
}: CardProps) => {
  return (
    <div
      {...props}
      className={classNames([className, `flex flex-col gap-6 p-6`])}
    >
      <h2 className="font-cyberbang text-3xl leading-normal">{title}</h2>
      <p className="text-center p-4">{description}</p>
    </div>
  );
};
