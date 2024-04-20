import { FormForgotPassword } from './form-forgot-password';

export default async function ForgotPassword({
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
        <FormForgotPassword data={{ linkRedirect }} />
      </div>
    </div>
  );
}
