import { Points } from '@/types/payload-types';
import { useMemo } from 'react';

export type LeaderboardPointProps = {
  position: number;
  point: Points;
};

export const LeaderboardPoint = async ({
  position,
  point,
}: LeaderboardPointProps) => {
  const referralPoints = useMemo(() => {
    const referrals: Points['referrals'] = point.referrals || [];
    return referrals.reduce(
      (acc, ref) => acc + (ref?.rewardsPointsEarned || 0),
      0,
    );
  }, [point.referrals]);

  const challengePoints = useMemo(() => {
    const claims: Points['claims'] = point.claims || [];
    return claims.reduce(
      (acc, ref) => acc + (ref?.rewardsPointsEarned || 0),
      0,
    );
  }, [point.claims]);

  return (
    <tr className="border-b border-zinc-500">
      <td className="p-3 text-center text-xl font-bold">{position}</td>
      <td className="p-3">{point.user?.name}</td>
      <td className="p-3">{challengePoints}</td>
      <td className="p-3">{referralPoints}</td>
      <td className="p-3">{point.rewardsPointsEarned}</td>
    </tr>
  );
};

export default LeaderboardPoint;
