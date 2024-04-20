'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';

export const HeaderWrapper = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const scrollTriggerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setScrolled] = useState(false);

  // Set scrolled state
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (scrollTriggerRef) {
        ScrollTrigger.create({
          trigger: scrollTriggerRef.current,
          start: `top top`,
          onEnterBack: () => {
            setScrolled(false);
          },
          onLeave: () => {
            setScrolled(true);
          },
        });
      }
    });

    return () => ctx.kill(true);
  }, []);

  // Add scrolled class to body
  useEffect(() => {
    if (isScrolled) {
      document.body.classList.add(`scrolled`);
    } else {
      document.body.classList.remove(`scrolled`);
    }
  }, [isScrolled]);

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        ref={scrollTriggerRef}
      />
      <header {...props}>{children}</header>
    </>
  );
};
