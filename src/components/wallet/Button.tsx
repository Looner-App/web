'use client';
import { LinkPayload } from '@/components/link';
// import { useActiveAccount } from 'thirdweb/react';
// const activeAccount = useActiveAccount();

import { User } from '@/types/payload-types';

import { AvatarThumbnail } from '../avatar/Thumbnail';
import Image from 'next/image';
import SignInButton from '@/libs/web3/thirdweb/components/SignInButton';

export type WalletButtonProps = {
  myPoints: number;
  user?: User | null;
  onGetUser?: () => Promise<User | null>;
};

export const WalletButton = ({ user = null, myPoints }: WalletButtonProps) => {
  return (
    <div>
      {user ? (
        <LinkPayload href={`/account`}>
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
            <div className="bg-zinc-700 px-2 py-1 rounded-md">
              <AvatarThumbnail user={user} className="rounded-full" />
            </div>
          </div>
        </LinkPayload>
      ) : (
        <SignInButton />
      )}
    </div>
  );
};
