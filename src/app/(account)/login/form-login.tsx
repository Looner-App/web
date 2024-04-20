'use client';

import { mergeStyle } from '@/libs/helper';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  email: string;
  password: string;
};

export interface IFormLogin extends React.FormHTMLAttributes<HTMLFormElement> {
  data?: {
    title?: string;
    linkRedirect?: string;
  };
}

export const FormLogin = ({ data, ...props }: IFormLogin) => {
  const title = data?.title || `<h1>Login Account</h1>`;
  const linkRedirect = data?.linkRedirect;

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
      const request = await fetch(`/api/users/login`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(data),
      });

      const result = await request.json();
      setMessage(result.message);

      if (request.status >= 200 && request.status <= 299) {
        setIsError(false);

        setTimeout(() => {
          if (linkRedirect) {
            router.push(linkRedirect);
          }

          router.refresh();
        }, 500);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <div
        className="text-3xl uppercase mb-10 font-black"
        dangerouslySetInnerHTML={{ __html: title }}
      />

      <div className="flex flex-col space-y-6">
        <div>
          <label>
            <span className="text-sm">Email</span>
            <input type="email" className="form-input" {...register(`email`)} />
          </label>
        </div>

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

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-jet-black text-fade-white border transition hocustive:bg-white hocustive:text-black rounded uppercase font-bold text-lg w-full py-2 px-6 disabled:opacity-50"
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
