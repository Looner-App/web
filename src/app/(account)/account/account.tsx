'use client';

import { useWalletName } from '@/libs/web3/thirdweb/hooks/useWalletName';

export type AccountProps = {
  fallback?: string;
};

export const Account = (props?: AccountProps) => {
  const { data: walletName } = useWalletName(props);

  return <>{walletName}</>;
};

export default Account;
