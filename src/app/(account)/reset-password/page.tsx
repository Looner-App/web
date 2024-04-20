import { notFound } from 'next/navigation';
import { FormResetPassword } from './form-reset-password';

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token;

  if (!token || typeof token !== `string`) {
    return notFound();
  }

  return (
    <div className="container w-fit overflow-hidden py-4">
      <div className="bg-jet-black p-10 rounded-lg border">
        <FormResetPassword data={{ token }} />
      </div>
    </div>
  );
}
