'use client';

import { Page } from '@/types/payload-types';
import { Children } from 'react';
import classnames from 'classnames';
import { Card } from './card';

type CardsList = Extract<
  NonNullable<Page['layout']>[0],
  { blockType: 'cards' }
>['cardsList'];

export type CardsProps = React.HTMLAttributes<HTMLElement> & {
  data: {
    description?: string | null;
    title?: string | null;
    cardsList: CardsList;
  };
};

export const Cards = ({ data, className, ...props }: CardsProps) => {
  const { description, title } = data;

  return (
    <section
      className={classnames(
        className,
        `container lg:my-10 lg:px-14 text-white flex flex-col gap-12`,
      )}
      {...props}
    >
      <div className="flex flex-col justify-center items-center">
        {title && (
          <div
            className="font-cyberbang text-7xl leading-normal text-center"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {description && (
          <div
            className="text-xl leading-8 text-center"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>

      <ul className="grid lg:grid-flow-col gap-6 text-center">
        {Children.toArray(
          (data.cardsList || []).map((card) => (
            <li>
              <Card title={card.title} description={card.description} />
            </li>
          )),
        )}
      </ul>
    </section>
  );
};
