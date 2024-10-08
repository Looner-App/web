import React, { FC, ReactNode } from 'react';

interface ButtonProps {
  type?: 'default' | 'hexagonal';
  children: ReactNode;
  className?: string;
}

const Button: FC<ButtonProps> = ({ type = `default`, children, className }) => {
  const baseClasses = `bg-[#C6FF00] text-black px-4  transition-all ease-in-out duration-300 focus:outline-none`;
  const hoverEffect = `hover:bg-[#B3E600] hover:text-black`;
  const clickEffect = `active:bg-[#A6DD00]`;

  const defaultStyle = `rounded-md ${baseClasses} ${hoverEffect} ${clickEffect} py-2`;
  const hexagonalStyle = `clip-path-hexagon ${baseClasses} ${hoverEffect} ${clickEffect} pb-2`;
  const joinClasses = (extra: string) => `${className} ${extra}`;

  return (
    <button
      className={joinClasses(
        type === `hexagonal` ? hexagonalStyle : defaultStyle,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
