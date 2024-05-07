import { Page } from '@/types/payload-types';
import { Leaderboard } from './leaderboard';

interface LeaderboardPayloadProps {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'leaderboard' }>;
  id?: string;
}

export const LeaderboardPayload = async ({
  data,
  id,
}: LeaderboardPayloadProps) => {
  return <Leaderboard data={data} cardVariant={data.cardVariant} id={id} />;
};
