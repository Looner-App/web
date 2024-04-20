'use client';

import { usePathname } from 'next/navigation';
import {
  useContext,
  createContext,
  Dispatch,
  useState,
  useEffect,
} from 'react';

interface MenuContextProps {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<boolean>;
}

const MenuContext = createContext<MenuContextProps>({
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => null,
});

interface MenuProviderProps {
  children: React.ReactNode;
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const value = {
    isMobileMenuOpen,
    setMobileMenuOpen,
  };

  // disable scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflowY = `hidden`;
      document.body.classList.add(`mobile-menu-open`);
    } else {
      document.body.style.overflowY = ``;
      document.body.classList.remove(`mobile-menu-open`);
    }

    return () => {
      document.body.style.overflowY = ``;
      document.body.classList.remove(`mobile-menu-open`);
    };
  }, [isMobileMenuOpen]);

  // Reset state on load new page
  const path = usePathname();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenuContext = () => {
  return useContext(MenuContext);
};
