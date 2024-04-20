import { LinkPayload } from '@/components/link';
import { fetchPayload } from '@/libs/api';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { HiCheck, HiOutlineX } from 'react-icons/hi';

export default async function Claim({
  params: { barcode },
  searchParams,
}: {
  params: { barcode: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let result = null;
  const isClaim = searchParams.claim;

  if (searchParams.claim) {
    result = await fetchPayload(`/custom/claim/${barcode}`, `PATCH`, {
      headers: {
        Cookie: cookies().toString(),
      },
      cache: `no-store`,
    });
  } else {
    result = await fetchPayload(`/custom/claim/${barcode}`, `GET`, {
      headers: {
        Cookie: cookies().toString(),
      },
      cache: `no-store`,
    });
  }

  if (!result) {
    return notFound();
  }

  const status = result.status;
  const json = await result.json();
  const message = json.message || json.errors[0].message;

  return (
    <div className="container w-fit overflow-hidden">
      <div className="bg-jet-black p-10 rounded-lg border text-center">
        {(status >= 200 && status <= 299) === false ? (
          // Item not found
          <>
            <div className="rounded-full border border-white w-14 h-14 p-2 mx-auto">
              <HiOutlineX className="w-full h-full" />
            </div>

            <div
              className="mt-5 text-xl uppercase font-medium leading-loose"
              dangerouslySetInnerHTML={{ __html: message }}
            />

            <hr className="my-5" />

            <div className="mt-8">
              <LinkPayload
                href="/account"
                className="uppercase border inline-block px-5 py-2 rounded-md transition duration-300 hocustive:bg-white hocustive:text-jet-black font-bold"
              >
                Item List
              </LinkPayload>
            </div>
          </>
        ) : isClaim ? (
          // Result claim
          <>
            <div className="rounded-full border border-white w-14 h-14 p-2 mx-auto">
              <HiCheck className="w-full h-full" />
            </div>

            <div
              className="mt-5 text-xl uppercase font-medium leading-loose"
              dangerouslySetInnerHTML={{ __html: message }}
            />

            <hr className="my-5" />

            <div className="mt-8">
              <LinkPayload
                href="/account"
                className="uppercase border inline-block px-5 py-2 rounded-md transition duration-300 hocustive:bg-white hocustive:text-jet-black font-bold"
              >
                Item List
              </LinkPayload>
            </div>
          </>
        ) : (
          // Item found, claim confirmation button
          <>
            <div
              className="text-xl uppercase font-medium leading-loose"
              dangerouslySetInnerHTML={{ __html: message }}
            />

            <hr className="my-5" />

            <div className="mt-8">
              <LinkPayload
                href={`/claim/${barcode}/?claim=true`}
                className="uppercase border inline-block px-5 py-2 rounded-md transition duration-300 bg-white text-jet-black font-bold hocustive:bg-jet-black hocustive:text-white"
              >
                Claim Now
              </LinkPayload>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
