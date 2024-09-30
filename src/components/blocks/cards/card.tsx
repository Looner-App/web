'use client';

import classNames from 'classnames';

import {
  Card as CardComponent,
  CardProps as CardComponentProps,
} from '@/components/card/Card';

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  title: string;
  description: string;
  cardVariant: CardComponentProps['cardVariant'];
};

export const Card = ({
  title,
  className,
  description,
  ...props
}: CardProps) => {
  return (
    <CardComponent
      {...props}
      className={classNames([className, `flex flex-col text-center`])}
    >
      <h2 className="font-geom text-3xl leading-normal">{title}</h2>
      <p className="text-center p-4 text-lg">{description}</p>
    </CardComponent>
  );
};
