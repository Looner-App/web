import { useActiveWallet, useEnsName, useSocialProfiles } from 'thirdweb/react';
import { toEllipsis } from '@/libs/helper';
import { allowedChainsConfig } from '../../chains/config';
import { useEffect, useMemo, useState } from 'react';
import { resolveL2Name } from 'thirdweb/extensions/ens';
import { useClient } from './useClient';

export type UseWalletNameProps = {
  fallback?: string;
};

export function useWalletName(props?: UseWalletNameProps) {
  const { fallback } = props || {
    fallback: `Connect Wallet`,
  };
  const { data: client } = useClient();
  const [name, setName] = useState<string | undefined>();
  const activeWallet = useActiveWallet();

  const { data: ens } = useEnsName({
    client,
    address: activeWallet?.getAccount()?.address,
  });

  const { data: profiles } = useSocialProfiles({
    client,
    address: activeWallet?.getAccount()?.address,
  });

  const profileENS = profiles?.find((profile) => profile.type === `ens`);

  const walletName = useMemo(() => {
    return (
      name ||
      ens ||
      profileENS?.name ||
      toEllipsis(activeWallet?.getAccount()?.address, 6, 6) ||
      fallback
    );
  }, [name, ens, fallback, profileENS, activeWallet]);

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
        client,
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

  return { data: walletName, client };
}
