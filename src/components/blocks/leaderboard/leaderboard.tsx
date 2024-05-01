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
      className={classnames(className, `container my-10 px-14 text-white`)}
      {...props}
    >
      <h1 className="text-center">Leaderboard</h1>
      <ScrollBar className="w-full">
        <table className="table-fixed border-separate border-spacing-y-6 max-lg:min-w-[40rem] w-full">
          <thead className="text-left">
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Challege points</th>
              <th>Referral points</th>
              <th>Total points</th>
            </tr>
          </thead>
          <tbody>
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
