'use client';

import { BsCopy } from 'react-icons/bs';
import classNames from 'classnames';
import { User } from '@/types/payload-types';

export type ButtonReferralProps = {
  user?: User | null;
  baseURL: string;
};

export const ButtonReferral = ({ user, baseURL }: ButtonReferralProps) => {
  const onCopy = () => {
    /// copy the url to the clipboard
    navigator.clipboard.writeText(
      `${baseURL}/register/?referral=${user?.referralCode}`,
    );
  };

  return (
    <button
      disabled={true}
      type="button"
      className={classNames([
        `text-black bg-white rounded-lg flex space-x-2 items-center py-2 px-4`,
        `disabled:opacity-50 disabled:cursor-not-allowed`,
        `hover:bg-gray-200`,
      ])}
      onClick={() => onCopy()}
    >
      <BsCopy className="text-black" />
      <span className="font-bold">Referral Link (soon)</span>
    </button>
  );
};

export default ButtonReferral;
