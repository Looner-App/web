import { get, getUser } from '@/libs/api';
import { Image } from '@/components/image';
import { MenuItem } from './menu-item';
import { AvatarThumbnail } from '@/components/avatar/Thumbnail';
import { Card } from '@/components/card';
import { headers } from 'next/headers';
import { ButtonReferral } from './button-referral';
import { Points, Referral } from '@/types/payload-types';
import { toEllipsis } from '@/libs/helper';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const docPoints = await get(`points`, {
    where: {
      user: {
        equals: user?.id,
      },
    },
  });

  const docReferral = await get(`referral`, {
    where: {
      user: {
        equals: user?.id,
      },
    },
  });

  const referral: Referral[] = docReferral?.docs || [];

  const points: Points[] = docPoints?.docs || [];

  const myPoints = points.reduce(
    (acc, curr) => acc + (curr.rewardsPointsEarned || 0),
    0,
  );

  const { referralPoints, rewardsProgramPoints } = points.reduce(
    (acc, curr) => {
      acc.referralPoints +=
        curr.referrals?.reduce(
          (acc, curr) => acc + (curr.rewardsPointsEarned || 0),
          0,
        ) || 0;
      acc.rewardsProgramPoints +=
        curr.claims?.reduce(
          (acc, curr) => acc + (curr.rewardsPointsEarned || 0),
          0,
        ) || 0;
      return acc;
    },
    {
      referralPoints: 0,
      rewardsProgramPoints: 0,
    },
  );

  const name = String(user?.name);

  /// get the url from
  const host = headers().get(`host`);

  const menuItems = [
    {
      href: `/account`,
      label: `Items`,
      segment: null,
    },
    {
      href: `/account/settings`,
      label: `Setting`,
      segment: `settings`,
    },
  ];

  return (
    <div className="container grid grid-cols-12 max-lg:gap-y-12 lg:gap-x-12">
      <div className="col-span-12 lg:col-span-4">
        <Card cardVariant={`secondary`} className="bg-zinc-900">
          <div className="grid grid-cols-12 p-8 gap-y-6 gap-x-4">
            <div className="col-span-6 lg:col-span-5 flex">
              <AvatarThumbnail user={user} width={180} height={180} />
            </div>
            <div className="col-span-6 lg:col-span-7">
              <ul className="flex flex-col space-y-4">
                <li>
                  <span className="font-black">{name}</span>
                </li>
                {user?.sub && (
                  <li>
                    <span className="text-xs">
                      {toEllipsis(user.sub, 5, 5)}
                    </span>
                  </li>
                )}
                <li className="flex space-x-4 items-center">
                  <span>My points</span>
                  <span>
                    <Image
                      src="/point.svg"
                      alt="point"
                      width={20}
                      height={20}
                    />
                  </span>
                  <span className="font-bold">{myPoints}</span>
                </li>
              </ul>
            </div>
            <div className="col-span-12 mb-6">
              <ul className="w-full flex flex-col space-y-4">
                <li className="flex space-x-4 items-center justify-between">
                  <span>Challenge points</span>
                  <span className="font-bold">{rewardsProgramPoints}</span>
                </li>
                <li className="flex space-x-4 items-center justify-between">
                  <span>Referral points</span>
                  <span className="font-bold">{referralPoints}</span>
                </li>
              </ul>
            </div>
            <div className="col-span-12">
              <div>
                <ButtonReferral baseURL={`${host}`} referral={referral[0]} />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-span-12 lg:col-span-8 flex flex-col space-y-12">
        <Card cardVariant={`secondary`} className="bg-zinc-900">
          <ul className="flex space-x-5 uppercase text-sm font-bold w-full p-8">
            {menuItems.map((item, _i) => (
              <MenuItem key={_i} href={item.href} segment={item.segment}>
                {item.label}
              </MenuItem>
            ))}
          </ul>
        </Card>
        {children}
      </div>
    </div>
  );
}
