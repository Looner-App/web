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
      className={classnames(className, `container my-10 px-14 text-white`)}
      {...props}
    >
      {title && <div dangerouslySetInnerHTML={{ __html: title }} />}

      {description && <div dangerouslySetInnerHTML={{ __html: description }} />}

      <ul className="grid lg:grid-flow-col gap-6 text-center">
        {Children.toArray(
          data.cardsList.map((card) => (
            <li className="p-8">
              <Card title={card.title} description={card.description} />
            </li>
          )),
        )}
      </ul>
    </section>
  );
};
