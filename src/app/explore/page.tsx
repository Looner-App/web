import dynamic from 'next/dynamic';
import { getDocs } from '@/libs/api';
import { IMapItems as IBlockComponent } from '@/components/blocks/map-items';
import { formatDistance } from 'date-fns';

const NianticDynamic = dynamic(() => import(`@/components/niantic`), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default async function Page() {
  const items = await getDocs({
    collection: `items`,
    cache: `no-cache`,
  });
  const dataPayload: IBlockComponent['data'] = {
    mapbox: {
      markers:
        items && items.docs.length
          ? items.docs
              .filter((e) => e.publicUniqueLink)
              .map((item) => {
                console.log(item);
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
                  marker_3d: {
                    url: item?.marker_3d?.url ?? null,
                  },
                  isTargetAR: item?.isTargetAR,
                };
              })
          : [],
    },
  };
  return (
    <>
      <NianticDynamic data={dataPayload.mapbox} />
    </>
  );
}
