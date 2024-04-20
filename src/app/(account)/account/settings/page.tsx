import { getUser } from '@/libs/api';
import { FormAccountSettings } from './form-account-settings';

export default async function Settings() {
  const user = await getUser();

  return (
    <>
      {user ? (
        <FormAccountSettings data={{ user }} />
      ) : (
        <>Something went wrong</>
      )}
    </>
  );
}
