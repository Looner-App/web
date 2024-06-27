'use client';

import { User } from '@/types/payload-types';

import Image from 'next/image';
import SignInButton from '@/libs/web3/thirdweb/components/SignInButton';
import { useActiveWallet } from 'thirdweb/react';
import { LinkPayload } from '../link';
import { mergeStyle } from '@/libs/helper';

export type WalletButtonProps = {
  myPoints: number;
  user?: User | null;
};

export const WalletButton = ({ user, myPoints }: WalletButtonProps) => {
  const activeWallet = useActiveWallet();

  return (
    <div className="flex max-lg:flex-col gap-4 items-center justify-center">
      {user && (
        <LinkPayload
          href="/account"
          className={mergeStyle(
            `relative transition duration-300 before:bg-fade-white before:w-0 before:h-px before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:transition-all before:duration-300`,
            `before:hocustive:w-full`,
          )}
        >
          Account
        </LinkPayload>
      )}
      {user && activeWallet?.getAccount()?.address ? (
        <div className="flex max-lg:flex-col gap-2 items-center">
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
