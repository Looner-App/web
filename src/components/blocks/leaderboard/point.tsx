import { Points } from '@/types/payload-types';
import { useMemo } from 'react';
import Image from 'next/image';
import { AvatarThumbnail } from '@/components/avatar/Thumbnail';

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
      <td className="p-3 flex space-x-2 items-center">
        <span>
          <AvatarThumbnail user={point?.user} />
        </span>
        <span>{point.user?.name}</span>
      </td>
      <td className="p-3">{challengePoints}</td>
      <td className="p-3">{referralPoints}</td>
      <td className="p-3 flex space-x-2 items-center">
        <span>
          <Image src="/loot.svg" alt="loot" width={20} height={20} />
        </span>
        <span>{point.rewardsPointsEarned}</span>
      </td>
    </tr>
  );
};

export default LeaderboardPoint;
