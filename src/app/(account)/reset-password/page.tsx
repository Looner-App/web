import { notFound } from 'next/navigation';
import { FormResetPassword } from './form-reset-password';
import { Card } from '@/components/card';

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
      <Card cardVariant={`secondary`} className="bg-zinc-900">
        <div className="p-8 text-center">
          <FormResetPassword data={{ token }} />
        </div>
      </Card>
    </div>
  );
}
