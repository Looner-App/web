import { getDocs, getUser } from '@/libs/api';
import { ClaimedItems, IClaimedItems } from './claimed-items';

export default async function Account() {
  const user = await getUser();

  const items = await getDocs({
    collection: `items`,
    variables: {
      'where[claimedBy][equals]': user?.id || 0,
    },
    cache: `no-store`,
  });

  const data: IClaimedItems['data'] = { items: [] };

  if (items && items.docs.length > 0) {
    data.items = items.docs.map((item) => ({
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
      <ClaimedItems data={data} />
    </>
  );
}
