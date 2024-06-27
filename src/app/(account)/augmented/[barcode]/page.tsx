import dynamic from 'next/dynamic';

const AframeDynamic = dynamic(() => import(`@/components/aframe`), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
export default async function Augmented({
  params: { barcode },
  searchParams,
}: {
  params: { barcode: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const result = null;
  console.log(result, barcode, searchParams);
  return (
    <div className="container w-fit overflow-hidden">
      <AframeDynamic />
    </div>
  );
}
