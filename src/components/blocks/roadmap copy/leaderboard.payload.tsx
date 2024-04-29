import { Page } from '@/types/payload-types';
import { Leaderboard } from './leaderboard';

interface LeaderboardPayloadProps {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'roadmap' }>;
  id?: string;
}

export const LeaderboardPayload = ({ data, id }: LeaderboardPayloadProps) => {
  console.log(data, id);
  const dataPayload = {};
  return <Leaderboard data={dataPayload} id={id} />;
};
