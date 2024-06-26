'use client';

import { User } from '@/types/payload-types';

import Image from 'next/image';
import SignInButton from '@/libs/web3/thirdweb/components/SignInButton';
import { useActiveWallet } from 'thirdweb/react';

export type WalletButtonProps = {
  myPoints: number;
  user?: User | null;
};

export const WalletButton = ({ user, myPoints }: WalletButtonProps) => {
  const activeWallet = useActiveWallet();
  return (
    <div>
      {user && activeWallet?.getAccount()?.address ? (
        <div className="flex space-x-2 items-center">
          <div className="bg-zinc-700 px-2 py-1 rounded-md flex items-center space-x-2">
            <span className="p-px">
              <Image
                src="/point.svg"
                alt="point"
                width={28}
                height={28}
                className="border border-zinc-700 rounded-full"
              />
            </span>
            <span className="font-sans">{myPoints}</span>
          </div>
          <SignInButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

export default WalletButton;
