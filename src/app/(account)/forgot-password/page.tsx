import { Card } from '@/components/card';
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
      <Card cardVariant={`secondary`} className="bg-zinc-900">
        <div className="p-8">
          <FormForgotPassword data={{ linkRedirect }} />
        </div>
      </Card>
    </div>
  );
}
