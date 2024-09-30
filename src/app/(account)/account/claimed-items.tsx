'use client';

import { IImagePayload, ImagePayload } from '@/components/image';
import { Points } from '@/types/payload-types';
import { format } from 'date-fns';
import Image from 'next/image';

export interface IClaimedItems {
  data: {
    claims: Points['claims'];
    items: {
      id: string;
      title: string;
      image?: IImagePayload['src'];
      category: string;
      shortCategory: string;
      claimedAt: Date;
    }[];
  };
}

export const ClaimedItems = ({ data }: IClaimedItems) => {
  const { claims = [] } = data;

  const findClaimedItemPoint = (id: string) => {
    if (!claims) return;

    const claimed = claims.find(
      (claim) => (claim?.claimable as any)?.id === id,
    );
    return claimed?.rewardsPointsEarned || 0;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4 items-center">
        <span className="font-bold uppercase font-geom text-lg">
          Drop. Find. Loot
        </span>
        <span className="font-medium text-sm flex-shrink-0">
          Phygital Item Collected : <b>{data.items.length}</b>
        </span>
      </div>

      <ul className="grid divide-y grid-cols-1 border border-zinc-700 divide-zinc-700 text-sm">
        {data.items.map((item, _i) => (
          <li key={_i} className="py-3 flex items-center">
            <div className="px-4 flex-shrink hidden md:block">
              <div className="w-10 h-10 bg-zinc-100/10 overflow-hidden rounded">
                {typeof item.image === `object` && (
                  <a
                    href={String(item.image.url)}
                    target="_blank"
                    title="thumbnail"
                  >
                    <ImagePayload
                      src={item.image}
                      size="thumbnail"
                      blur={false}
                      width={40}
                      height={40}
                    />
                  </a>
                )}
              </div>
            </div>

            <div className="px-4 flex-1 font-bold">{item.title}</div>

            <div className="px-4 flex-1 md:block hidden">{item.category}</div>

            <div className="px-4 flex-1 md:hidden">{item.shortCategory}</div>

            <div className="px-4 flex-1">
              {format(String(item.claimedAt), `MM.dd.yy KK:mmaaa`)}
            </div>

            <div className="px-4 flex space-x-4 items-center">
              <span>
                <Image src="/point.svg" alt="point" width={20} height={20} />
              </span>
              <span>{findClaimedItemPoint(item.id)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
