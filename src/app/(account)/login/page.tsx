import { LinkPayload } from '@/components/link';
import { FormLogin } from './form-login';
import { Card } from '@/components/card';

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
      <Card cardVariant={`secondary`} className="bg-zinc-900">
        <div className="p-8">
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
      </Card>
    </div>
  );
}
