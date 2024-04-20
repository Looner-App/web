import { LinkPayload } from '@/components/link';
import { FormLogin } from './form-login';

export default async function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let linkRegister = `/register`;
  let linkForgotPassword = `/forgot-password`;
  const linkRedirect =
    typeof searchParams.redirect === `string`
      ? searchParams.redirect
      : undefined;

  if (linkRedirect) {
    linkRegister += `?redirect=${linkRedirect}`;
    linkForgotPassword += `?redirect=${linkRedirect}`;
  }

  return (
    <div className="container w-fit overflow-hidden py-4">
      <div className="bg-jet-black p-10 rounded-lg border">
        <FormLogin data={{ linkRedirect }} />

        <div className="flex mt-10 flex-col space-y-4 items-center text-lg font-medium">
          <LinkPayload
            href={linkForgotPassword}
            className="transition hocustive:opacity-50"
          >
            Forgot Password
          </LinkPayload>
          <LinkPayload
            href={linkRegister}
            className="transition hocustive:opacity-50"
          >
            Create Account
          </LinkPayload>
        </div>
      </div>
    </div>
  );
}
