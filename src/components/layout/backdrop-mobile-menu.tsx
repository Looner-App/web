'use client';

import { useMenuContext } from '@/libs/context';

export const BackdropMobileMenu = () => {
  const { setMobileMenuOpen } = useMenuContext();

  return (
    <div
      className="fixed invisible opacity-0 w-full h-full mobile-menu-open:visible mobile-menu-open:opacity-100 backdrop-blur transition-all"
      onClick={() => setMobileMenuOpen(false)}
    />
  );
};
