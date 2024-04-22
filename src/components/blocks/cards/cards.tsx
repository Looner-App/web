import { Page } from '@/types/payload-types';
import { Children } from 'react';
import classnames from 'classnames';

type CardsList = Extract<
  NonNullable<Page['layout']>[0],
  { blockType: 'cards' }
>['cardsList'];

export type CardsProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  data: {
    cardsList: CardsList;
  };
};

export const Cards = ({ data, className, ...props }: CardsProps) => {
  return (
    <section
      className={classnames(className, `container my-10 px-14 text-white`)}
      {...props}
    >
      <ul className="grid grid-flow-col gap-6 text-center">
        {Children.toArray(
          data.cardsList.map((card) => (
            <li className="p-8">
              <div>
                <h2 className="uppercase text-2xl font-bold ">{card.title}</h2>
                <p>{card.description}</p>
              </div>
            </li>
          )),
        )}
      </ul>
    </section>
  );
};
