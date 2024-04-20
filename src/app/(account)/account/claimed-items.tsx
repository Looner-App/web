'use client';

import { ImagePayload, IImagePayload } from '@/components/image';
import { format } from 'date-fns';

export interface IClaimedItems {
  data: {
    items: {
      title: string;
      image?: IImagePayload['src'];
      category: string;
      shortCategory: string;
      claimedAt: Date;
    }[];
  };
}

export const ClaimedItems = ({ data }: IClaimedItems) => {
  return (
    <>
      <div className="mb-5 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5 md:justify-between">
        <span className="font-bold uppercase">Drop. Find. Loot</span>
        <span className="font-medium text-sm flex-shrink-0">
          Phygital Item Collected : <b>{data.items.length}</b>
        </span>
      </div>

      <ul className="grid divide-y grid-cols-1 border rounded-md border-fade-white divide-fade-white text-sm -mx-4">
        {data.items.map((item, _i) => (
          <li key={_i} className="py-3 flex items-center">
            <div className="px-4 flex-shrink hidden md:block">
              <div className="w-10 h-10 bg-zinc-100/10 overflow-hidden rounded">
                {typeof item.image === `object` && (
                  <a href={String(item.image.url)} target="_blank">
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

            <div className="px-4 flex-1 max-w-32">
              {format(String(item.claimedAt), `MM.dd.yy KK:mmaaa`)}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
