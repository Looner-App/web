'use client';

import { ConnectButton, useActiveWallet } from 'thirdweb/react';
import { client } from '@/libs/web3/thirdweb/client';
import { wallets } from '@/libs/web3/thirdweb/wallets';
import { useRouter } from 'next/navigation';
import { toEllipsis } from '@/libs/helper';
import { thirdwebChains } from '../../chains/config';
import './signin-button.css';

const clientInstance = client({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});
export const SignInButton = () => {
  const router = useRouter();
  const activeWallet = useActiveWallet();
  return (
    <div className="bg-glow-green text-black rounded-lg button-wallet">
      <ConnectButton
        client={clientInstance}
        wallets={wallets}
        theme={`dark`}
        chain={thirdwebChains[0]}
        chains={thirdwebChains}
        connectButton={{
          label: `Connect`,
          style: {
            backgroundColor: `transparent !important`,
          },
        }}
        detailsButton={{
          style: {
            background: `transparent !important`,
          },
          render: () => (
            <button type="button">
              {toEllipsis(activeWallet?.getAccount()?.address, 6, 6) ||
                `Connect Wallet`}
            </button>
          ),
        }}
        signInButton={{
          label: `Sign In`,
        }}
        connectModal={{
          size: `compact`,
          showThirdwebBranding: false,
        }}
        auth={{
          getLoginPayload: async ({ address, chainId }) => {
            const { data } = await fetch(
              `/api/users/auth?address=${address}&chainId=${chainId}`,
              {
                method: `GET`,
              },
            ).then((res) => res.json());

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
    </div>
  );
};

export default SignInButton;
