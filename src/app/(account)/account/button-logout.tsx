'use client';

import { useRouter } from 'next/navigation';

export const ButtonLogout = ({
  children = `Logout`,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await fetch(`/api/users/logout`, { method: `POST` });

    if (result.status) {
      router.refresh();
    }
  };

  return (
    <button onClick={() => handleLogout()} {...props}>
      {children}
    </button>
  );
};
