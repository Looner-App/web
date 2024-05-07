import classnames from 'classnames';

import { Points } from '@/types/payload-types';
// import { Children } from 'react';
// import LeaderboardPoint from './point';
import ScrollBar from '@/components/Scrollbar';
import {
  Card as CardComponent,
  CardProps as CardComponentProps,
} from '@/components/card/Card';

export type LeaderboardProps = React.HTMLAttributes<HTMLElement> & {
  data: Points[];
  cardVariant: CardComponentProps['cardVariant'];
};

export const Leaderboard = async ({
  className,
  // data,
  cardVariant,
  ...props
}: LeaderboardProps) => {
  return (
    <section
      className={classnames(
        className,
        `container lg:my-10 lg:px-14 text-white flex flex-col gap-12`,
      )}
      {...props}
    >
      <h1 className="font-cyberbang text-xl lg:text-3xl leading-normal text-center">
        Leaderboard
      </h1>
      <ScrollBar className="w-full">
        <CardComponent cardVariant={cardVariant}>
          <table className="table-fixed border-collapse max-lg:min-w-[40rem] w-full">
            <thead className="text-left bg-zinc-700">
              <tr>
                <th className="p-3 text-center">Rank</th>
                <th className="p-3">Player</th>
                <th className="p-3">Challege points</th>
                <th className="p-3">Referral points</th>
                <th className="p-3">Total points</th>
              </tr>
            </thead>
            <tbody className="bg-zinc-900">
              {/* {Children.toArray(
                data.map((point, index) => (
                  <LeaderboardPoint point={point} position={index + 1} />
                )),
              )} */}
            </tbody>
          </table>
        </CardComponent>
      </ScrollBar>
    </section>
  );
};

export default Leaderboard;
