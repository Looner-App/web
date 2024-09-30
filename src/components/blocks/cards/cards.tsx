'use client';

import { Page } from '@/types/payload-types';
import { Children } from 'react';
import classnames from 'classnames';
import { Card } from './card';
import Stronger from '@/components/Stronger';

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
        `container lg:my-10 lg:px-14 text-white flex flex-col gap-24`,
      )}
      {...props}
    >
      <div className="flex flex-col justify-center items-center gap-12">
        {title && (
          <div className="font-geom text-5xl lg:text-7xl leading-normal max-lg:text-center">
            <Stronger message={title} />
          </div>
        )}

        {description && (
          <div
            className="text-xl leading-8 text-center lg:max-w-[28rem]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>

      <ul className="flex lg:space-x-8 max-lg:flex-col max-lg:space-y-8">
        {Children.toArray(
          (data.cardsList || []).map((card) => (
            <li>
              <Card
                title={card.title}
                description={card.description}
                cardVariant={card.cardVariant}
              />
            </li>
          )),
        )}
      </ul>
    </section>
  );
};
