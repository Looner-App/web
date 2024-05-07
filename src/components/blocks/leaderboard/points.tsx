import { Points, RewardsProgram } from '@/types/payload-types';
import { Children } from 'react';
import { LeaderboardPoint } from './point';
import { get } from '@/libs/api';

export type LeaderboardProps = React.HTMLAttributes<HTMLElement> & {
  rewardsProgram?: RewardsProgram;
};

export const Leaderboard = async ({ rewardsProgram }: LeaderboardProps) => {
  const result = await get(`points`, {
    where: {
      or: [
        {
          and: [
            {
              rewardsProgram: {
                equals: rewardsProgram?.id,
              },
            },
          ],
        },
      ],
    },
    sort: `~rewardsPointsEarned`,
  });

  const docs: Points[] = result.docs;

  return (
    <>
      {Children.toArray(
        docs.map((point, index) => (
          <LeaderboardPoint point={point} position={index + 1} />
        )),
      )}
    </>
  );
};

export default Leaderboard;
