import { get, getDocs, getUser } from '@/libs/api';
import { ClaimedItems, IClaimedItems } from './claimed-items';
import { Card } from '@/components/card';
import { Points } from '@/types/payload-types';

export default async function Account() {
  const user = await getUser();

  const items = await getDocs({
    collection: `items`,
    variables: {
      'where[claimedBy][equals]': user?.id || 0,
    },
    cache: `no-store`,
  });
  const doc = await get(`points`, {
    where: {
      user: {
        equals: user?.id,
      },
    },
  });

  const points: Points[] = doc?.docs || [];
  const data: IClaimedItems['data'] = {
    items: [],
    claims: points.map((point) => point.claims).flat() as Points['claims'],
  };

  if (items && items.docs.length > 0) {
    data.items = items.docs.map((item) => ({
      id: item.id,
      title: item.title,
      image:
        item.image && typeof item.image === `object` ? item.image : undefined,
      category: typeof item.category === `object` ? item.category.title : `-`,
      shortCategory:
        typeof item.category === `object`
          ? item.category.shortTitle || item.category.title
          : `-`,
      claimedAt: new Date(String(item.claimedAt)),
    }));
  }

  return (
    <>
      <Card cardVariant={`secondary`} className="bg-zinc-900">
        <div className="p-8">
          <ClaimedItems data={data} />
        </div>
      </Card>
    </>
  );
}
