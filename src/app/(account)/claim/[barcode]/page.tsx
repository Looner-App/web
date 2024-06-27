import { LinkPayload } from '@/components/link';
import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { HiMiniBolt } from 'react-icons/hi2';

export default async function Claim({
  params: { barcode },
}: {
  params: { barcode: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let result = null;
  result = await fetchPayload(`/custom/claim/${barcode}`, `PATCH`, {
    headers: {
      Cookie: cookies().toString(),
    },
    cache: `no-store`,
  });

  if (!result) {
    return notFound();
  }

  return (
    <div className="container w-fit overflow-hidden pt-[50px]">
      <div className="p-8 text-center">
        <div className="w-14 h-14 p-2 mx-auto">
          <HiMiniBolt className="w-full h-full" />
        </div>

        <h1 className="text-[32px] text-white"> Congratulations </h1>
        <p className="text-white text-[21px]">
          You find the AR Scavenger on `The Hunt`
        </p>

        <div className="mt-8">
          <LinkPayload
            href={{
              type: `link`,
              url: `/maps`,
            }}
            className="uppercase border inline-block
                  px-5 py-2 rounded-md transition duration-300 hocustive:bg-white hocustive:text-jet-black font-bold"
          >
            GO TO MAP
          </LinkPayload>
        </div>
      </div>
    </div>
  );
}
