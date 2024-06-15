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
      signInButton={{
        label: `Sign In`,
      }}
      connectModal={{
        size: `compact`,
        showThirdwebBranding: false,
      }}
      auth={{
        getLoginPayload: async ({ address }) => {
          const { data } = await fetch(`/api/users/auth?address=${address}`, {
            method: `GET`,
          }).then((res) => res.json());

          return data;
        },

        doLogin: async (params) => {
          const { data } = await fetch(`/api/users/auth`, {
            method: `POST`,
            headers: {
              'Content-Type': `application/json`,
            },
            body: JSON.stringify(params),
          }).then((res) => res.json());

          if (data.token) {
            setTimeout(() => {
              router.push(`/account`);
              router.refresh();
            }, 500);
          }
        },

        isLoggedIn: async () => {
          const { data } = await fetch(`/api/users/auth/account`, {
            method: `GET`,
          }).then((res) => res.json());

          return data.isLoggedIn;
        },

        doLogout: async () => {
          await fetch(`/api/users/auth/logout`, {
            method: `POST`,
          }).then((res) => res.json());

          setTimeout(() => {
            router.push(`/`);
            router.refresh();
          }, 500);
        },
      }}
    />
  );
};

export default SignInButton;
