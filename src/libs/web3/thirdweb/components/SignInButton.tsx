'use client';

import { ConnectButton } from 'thirdweb/react';
import { client } from '@/libs/web3/thirdweb/client';
import { wallets } from '@/libs/web3/thirdweb/wallets';
import { useRouter } from 'next/navigation';

const BASE_API_URL = `http://localhost:3001`;

export const SignInButton = () => {
  const router = useRouter();
  return (
    <ConnectButton
      client={client({ clientId: `4d6615a2994abbcdcc071396807c0140` })}
      wallets={wallets}
      theme={`dark`}
      connectButton={{ label: `Connect` }}
      connectModal={{
        size: `compact`,
        showThirdwebBranding: false,
      }}
      auth={{
        isLoggedIn: async () => {
          const result = await fetch(
            `${BASE_API_URL}/api/users/auth/account`,
          ).then((res) => res.json());
          return result.isLoggedIn;
        },
        doLogin: async (params) => {
          const result = await fetch(`${BASE_API_URL}/api/user/auth`, {
            method: `POST`,
            headers: {
              'Content-Type': `application/json`,
            },
            body: JSON.stringify(params),
          }).then((res) => res.json());

          if (result.token) {
            router.replace(`/test`);
          }
        },
        getLoginPayload: async ({ address }) => {
          const result = await fetch(
            `${BASE_API_URL}/api/users/auth/login?address=${address}`,
          ).then((res) => res.json());
          return result;
        },
        doLogout: async () => {
          return fetch(`${BASE_API_URL}/api/users/auth/logout`).then((res) =>
            res.json(),
          );
        },
      }}
    />
  );
};

export default SignInButton;
