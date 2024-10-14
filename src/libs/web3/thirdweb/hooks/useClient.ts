import { client } from '@/libs/web3/thirdweb/client';

export const clientInstance = client({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export function useClient() {
  return { data: clientInstance };
}
