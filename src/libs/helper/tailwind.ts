import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const mergeStyle = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
