'use client';

import { HTMLProps } from 'react';
import { ThirdwebProvider as ThirdwebProviderComponent } from 'thirdweb/react';

export const WalletProvider = ({ children }: HTMLProps<HTMLDivElement>) => {
  return <ThirdwebProviderComponent>{children}</ThirdwebProviderComponent>;
};
