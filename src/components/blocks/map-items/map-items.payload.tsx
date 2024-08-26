import { formatDistance } from 'date-fns';
import { Page } from '@/types/payload-types';
import { getDocs } from '@/libs/api';
import {
  IMapItems as IBlockComponent,
  MapItems as BlockComponent,
} from './map-items';

interface IBlockPayload {
  data: Extract<NonNullable<Page['layout']>[0], { blockType: 'map-items' }>;
  id?: string;
}

export const MapItemsPayload = async ({ data, id }: IBlockPayload) => {
  const items = await getDocs({
    collection: `items`,
    cache: `no-cache`,
  });

  const dataPayload: IBlockComponent['data'] = {
    title: data.title?.html || undefined,
    mapbox: {
      // initZoom: 10,
      markers:
        items && items.docs.length
          ? items.docs.map((item) => {
              return {
                lng: item.location[0],
                lat: item.location[1],
                status: item.claimedBy && item.claimedAt ? `looted` : `live`,
                title: item.title,
                desc: item.desc?.html || undefined,
                image:
                  item.image && typeof item.image === `object`
                    ? String(item.image.url)
                    : undefined,
                createdAt: new Date(item.createdAt),
                claimedBy:
                  typeof item.claimedBy === `object` && item.claimedBy?.name
                    ? item.claimedBy.name
                    : undefined,
                claimedDuration: item.claimedAt
                  ? formatDistance(item.claimedAt, item.createdAt)
                  : undefined,
                publicUniqueLink: item?.publicUniqueLink || false,
                uniqueLink:
                  item?.publicUniqueLink && item?.uniqueLink
                    ? item.uniqueLink
                    : undefined,
                marker_3d: item?.marker_3d || ``,
              };
            })
          : [],
    },
  };

  return <BlockComponent data={dataPayload} id={id} />;
};
