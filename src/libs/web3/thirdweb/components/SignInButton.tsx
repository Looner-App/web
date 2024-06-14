'use client';

import { ConnectButton } from 'thirdweb/react';
import { client } from '@/libs/web3/thirdweb/client';
import { wallets } from '@/libs/web3/thirdweb/wallets';
import { useRouter } from 'next/navigation';

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
        getLoginPayload: async ({ address }) => {
          const { data } = await fetch(`/api/auth?address=${address}`, {
            method: `GET`,
          }).then((res) => res.json());

          return data;
        },

        doLogin: async (params) => {
          const { data } = await fetch(`/api/auth`, {
            method: `POST`,
            headers: {
              'Content-Type': `application/json`,
            },
            body: JSON.stringify(params),
          }).then((res) => res.json());

          if (data.token) {
            router.replace(`/account`);
          }
        },

        isLoggedIn: async () => {
          const { data } = await fetch(`/api/auth/account`, {
            method: `GET`,
          }).then((res) => res.json());
          return data.isLoggedIn;
        },

        doLogout: async () => {
          await fetch(`/api/auth/logout`, {
            method: `GET`,
          }).then((res) => res.json());
        },
      }}
    />
  );
};

export default SignInButton;
