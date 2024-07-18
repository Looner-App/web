'use client';

import { BsCopy } from 'react-icons/bs';
import classNames from 'classnames';
import { User } from '@/types/payload-types';
import { useState } from 'react';

export type ButtonReferralProps = {
  user?: User | null;
  baseURL: string;
};

export const ButtonReferral = ({ user, baseURL }: ButtonReferralProps) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    /// copy the url to the clipboard
    navigator.clipboard
      .writeText(`${baseURL}/?referral=${user?.referralCode}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      });
  };

  return (
    <div className="flex gap-2 items-center">
      <div>
        <button
          type="button"
          className={classNames([
            `text-black bg-white rounded-lg flex space-x-2 items-center py-2 px-4`,
            `disabled:opacity-50 disabled:cursor-not-allowed`,
            `hover:bg-gray-200`,
          ])}
          onClick={() => onCopy()}
        >
          <BsCopy className="text-black" />
          <span className="font-bold">Referral Link</span>
        </button>
      </div>
      {copied && (
        <div className="text-xs text-gray-500 mt-2">Copied to clipboard</div>
      )}
    </div>
  );
};

export default ButtonReferral;
