import { FormRegister } from './form-register';

export default async function Register({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const linkRedirect =
    typeof searchParams.redirect === `string`
      ? searchParams.redirect
      : undefined;

  return (
    <div className="container w-fit overflow-hidden py-4">
      <div className="bg-jet-black p-10 rounded-lg border">
        <FormRegister data={{ linkRedirect }} />
      </div>
    </div>
  );
}
