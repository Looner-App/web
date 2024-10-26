'use client';

import { ConnectButton, AutoConnect } from 'thirdweb/react';
import { wallets } from '@/libs/web3/thirdweb/wallets';
import { useRouter } from 'next/navigation';
import { thirdwebChains } from '../../chains/config';
import './signin-button.css';
import dynamic from 'next/dynamic';
import { useWalletName } from '@/libs/web3/thirdweb/hooks/useWalletName';

const Button = dynamic(() => import(`@/components/button`), {
  ssr: false,
});

export const SignInButton = () => {
  const router = useRouter();

  const { data: walletName, client } = useWalletName();

  return (
    <>
      <AutoConnect
        client={client}
        wallets={wallets}
        chain={thirdwebChains[0]}
      />
      <Button type="default" className="button-wallet">
        <ConnectButton
          client={client}
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
              padding: `0px !important`,
              margin: `0px !important`,
            },
            render() {
              return <>{walletName}</>;
            },
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
      </Button>
    </>
  );
};

export default SignInButton;
