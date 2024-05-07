export const dynamic = `force-dynamic`;

import { Page } from '@/types/payload-types';
import { Leaderboard } from './leaderboard';
import { get } from '@/libs/api';

interface LeaderboardPayloadProps {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'leaderboard' }>;
  id?: string;
}

export const LeaderboardPayload = async ({
  data,
  id,
}: LeaderboardPayloadProps) => {
  const doc = await get(`points`, {
    where: {
      or: [
        {
          and: [
            {
              rewardsProgram: {
                equals: data.rewardsProgram?.id,
              },
            },
          ],
        },
      ],
    },
    sort: `~rewardsPointsEarned`,
  });

  return <Leaderboard data={doc.docs} cardVariant={data.cardVariant} id={id} />;
};
