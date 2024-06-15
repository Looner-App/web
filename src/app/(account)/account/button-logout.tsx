'use client';

import { useRouter } from 'next/navigation';
import { useDisconnect, useActiveWallet } from 'thirdweb/react';

export const ButtonLogout = ({
  children = `Logout`,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  const handleLogout = async () => {
    const result = await fetch(`/api/users/auth/logout`, { method: `POST` });

    if (result.status) {
      if (wallet) {
        disconnect(wallet);
      }
      setTimeout(() => {
        router.push(`/`);
        router.refresh();
      }, 500);
    }
  };

  return (
    <button onClick={() => handleLogout()} {...props}>
      {children}
    </button>
  );
};
