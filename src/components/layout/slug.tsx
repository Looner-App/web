'use client';

import { WalletProvider } from '@/libs/web3/thirdweb/components/Provider';

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletProvider>{children}</WalletProvider>;
}
