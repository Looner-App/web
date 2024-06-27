import dynamic from 'next/dynamic';
import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const AframeDynamic = dynamic(() => import(`@/components/aframe`), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
export default async function Augmented({
  params: { barcode },
}: {
  params: { barcode: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let result = null;
  result = await fetchPayload(`/custom/claim/${barcode}`, `GET`, {
    headers: {
      Cookie: cookies().toString(),
    },
    cache: `no-store`,
  });
  if (!result) {
    return notFound();
  }
  const json = await result.json();
  return (
    <>
      <div className="container w-fit overflow-hidden">
        <AframeDynamic link={json?.data?.uniqueLink} />
      </div>
    </>
  );
}
