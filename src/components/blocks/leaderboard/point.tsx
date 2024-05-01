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
    <tr>
      <td>{position}</td>
      <td>{point.user?.name}</td>
      <td>{challengePoints}</td>
      <td>{referralPoints}</td>
      <td>{point.rewardsPointsEarned}</td>
    </tr>
  );
};

export default LeaderboardPoint;
