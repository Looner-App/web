'use client';

import { useMenuContext } from '@/libs/context';
import { useEffect } from 'react';

export const ButtonMobileMenu = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { isMobileMenuOpen, setMobileMenuOpen } = useMenuContext();

  // Close menu on `esc` press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === `Escape`) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener(`keydown`, handleEsc);

    return () => {
      window.removeEventListener(`keydown`, handleEsc);
    };
  }, []);

  return (
    <button
      type="button"
      className="flex items-center"
      onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
      {...props}
    >
      <div className="flex flex-col justify-between w-[18px] h-[13.5px] mobile-menu-open:scale-75 transition duration-300">
        <span className="rounded-full bg-white h-[1.5px] block transition-all duration-500 mobile-menu-open:rotate-45 origin-top-left" />
        <span className="rounded-full bg-white h-[1.5px] block transition-all duration-500 mobile-menu-open:opacity-0" />
        <span className="rounded-full bg-white h-[1.5px] block transition-all duration-500 origin-bottom-left mobile-menu-open:-rotate-45" />
      </div>
    </button>
  );
};
