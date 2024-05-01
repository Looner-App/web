import { getUser } from '@/libs/api';
import { FormAccountSettings } from './form-account-settings';
import { Card } from '@/components/card';

export default async function Settings() {
  const user = await getUser();

  return (
    <Card cardVariant={`secondary`} className="bg-zinc-900">
      <div className="p-8">
        {user ? (
          <FormAccountSettings data={{ user }} />
        ) : (
          <>Something went wrong</>
        )}
      </div>
    </Card>
  );
}
