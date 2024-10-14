'use client';

import {
  ConnectButton,
  useActiveWallet,
  useEnsName,
  useSocialProfiles,
} from 'thirdweb/react';
import { client } from '@/libs/web3/thirdweb/client';
import { wallets } from '@/libs/web3/thirdweb/wallets';
import { useRouter } from 'next/navigation';
import { toEllipsis } from '@/libs/helper';
import { thirdwebChains, allowedChainsConfig } from '../../chains/config';
import './signin-button.css';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { resolveL2Name } from 'thirdweb/extensions/ens';

const Button = dynamic(() => import(`@/components/button`), {
  ssr: false,
});
const clientInstance = client({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const SignInButton = () => {
  const [name, setName] = useState(``);
  const router = useRouter();
  const activeWallet = useActiveWallet();

  const { data: ens } = useEnsName({
    client: clientInstance,
    address: activeWallet?.getAccount()?.address,
  });

  const { data: profiles } = useSocialProfiles({
    client: clientInstance,
    address: activeWallet?.getAccount()?.address,
  });

  const walletName = useMemo(() => {
    return (
      name ||
      ens ||
      profiles?.[0]?.name ||
      toEllipsis(activeWallet?.getAccount()?.address, 6, 6) ||
      `Connect wallet`
    );
  }, [name, ens, profiles, activeWallet]);

  useEffect(() => {
    const getL2Basename = async () => {
      if (!activeWallet) return;
      const address = activeWallet?.getAccount()?.address;
      if (!address) return;

      const chain = activeWallet.getChain();
      if (!chain) return;

      const chainCustom = allowedChainsConfig[chain.id];
      if (!chainCustom) return;

      return await resolveL2Name({
        client: clientInstance,
        address,
        resolverAddress: chainCustom?.custom
          ?.resolverAddress as unknown as string,
        resolverChain: chain,
      });
    };

    getL2Basename().then((result) => {
      if (result) {
        setName(result);
      }
    });
  });

  return (
    <Button type="default" className="button-wallet">
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
            padding: `0px !important`,
            margin: `0px !important`,
          },
          render() {
            return <>{walletName}</>;
          },
        }}
        // detailsButton={{
        //   style: {
        //     background: `transparent !important`,
        //   },
        //   render: () => (
        //     <button type="button">
        //       {toEllipsis(activeWallet?.getAccount()?.address, 6, 6) ||
        //         `Connect Wallet`}
        //     </button>
        //   ),
        // }}
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
  );
};

export default SignInButton;
