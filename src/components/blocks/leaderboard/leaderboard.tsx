import classnames from 'classnames';

import { Points } from '@/types/payload-types';
import { Children } from 'react';
import LeaderboardPoint from './point';
import ScrollBar from '@/components/Scrollbar';

export type LeaderboardProps = React.HTMLAttributes<HTMLElement> & {
  data: Points[];
};

export const Leaderboard = async ({
  className,
  data,
  ...props
}: LeaderboardProps) => {
  return (
    <section
      className={classnames(
        className,
        `container çg:my-10 lg:px-14 text-white flex flex-col gap-24`,
      )}
      {...props}
    >
      <h1 className="font-cyberbang text-xl lg:text-3xl leading-normal text-center">
        Leaderboard
      </h1>
      <ScrollBar className="w-full">
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
            {Children.toArray(
              data.map((point, index) => (
                <LeaderboardPoint point={point} position={index + 1} />
              )),
            )}
          </tbody>
        </table>
      </ScrollBar>
    </section>
  );
};

export default Leaderboard;
