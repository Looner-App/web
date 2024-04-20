'use client';

import { mergeStyle } from '@/libs/helper';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  token: string;
  password: string;
  confirmPassword: string;
};

export interface IFormResetPassword
  extends React.FormHTMLAttributes<HTMLFormElement> {
  data: {
    token: string;
    title?: string;
    linkLogin?: string;
  };
}

export const FormResetPassword = ({ data, ...props }: IFormResetPassword) => {
  const title = data?.title || `<h1>Reset Password</h1>`;
  const linkLogin = data.linkLogin || `/login`;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  const router = useRouter();

  const [message, setMessage] = useState(``);
  const [isError, setIsError] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const request = await fetch(`/api/users/reset-password`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(data),
      });

      const result = await request.json();
      setMessage(result.message);

      if (request.status >= 200 && request.status <= 299) {
        setIsError(false);

        setTimeout(() => router.push(linkLogin), 1000);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <input type="hidden" defaultValue={data.token} {...register(`token`)} />

      <div
        className="text-3xl uppercase mb-10 font-black"
        dangerouslySetInnerHTML={{ __html: title }}
      />

      <div className="flex flex-col space-y-6">
        <div>
          <label>
            <span className="text-sm">Password</span>
            <input
              type="password"
              className="form-input"
              {...register(`password`)}
            />
          </label>
        </div>

        <div>
          <label>
            <span className="text-sm">Confirm Password</span>
            <input
              type="password"
              className="form-input"
              {...register(`confirmPassword`)}
            />
          </label>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-jet-black text-white border transition hocustive:bg-white hocustive:text-jet-black rounded uppercase font-bold text-lg w-full py-2 px-6 disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </div>

      {message && (
        <div
          className={mergeStyle(
            `mt-4 font-medium`,
            isError ? `text-red-700` : `text-green-700`,
          )}
        >
          {message}
        </div>
      )}
    </form>
  );
};
