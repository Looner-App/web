'use client';

import { LinkPayload } from '@/components/link';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  email: string;
};

export interface IFormForgotPassword
  extends React.FormHTMLAttributes<HTMLFormElement> {
  data?: {
    title?: string;
    linkLogin?: string;
    linkRedirect?: string;
    successMessageTitle?: string;
    successMessageDesc?: string;
  };
}

export const FormForgotPassword = ({ data, ...props }: IFormForgotPassword) => {
  const title = data?.title || `<h1>Forgot Password</h1>`;
  let linkLogin = data?.linkLogin || `/login`;
  const linkRedirect = data?.linkRedirect;

  if (linkRedirect) {
    linkLogin += `?redirect=${linkRedirect}`;
  }

  const successMessageTitle = data?.successMessageTitle || `Email reset sent`;
  const successMessageDesc =
    data?.successMessageDesc ||
    `Please follow the instructions in the email to reset your account.`;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  const [message, setMessage] = useState(``);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const request = await fetch(`/api/users/forgot-password`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(data),
      });

      const result = await request.json();
      setMessage(result.message);

      if (request.status >= 200 && request.status <= 299) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return !isSuccess ? (
    <>
      <form onSubmit={handleSubmit(onSubmit)} {...props}>
        <div
          className="text-3xl uppercase mb-10 font-black"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <div className="flex flex-col space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              {...register(`email`)}
            />
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
          <div className="mt-4 font-medium text-red-700">{message}</div>
        )}
      </form>

      <div className="flex mt-10 flex-col space-y-4 items-center text-lg font-medium">
        <LinkPayload
          href={linkLogin}
          className="transition hocustive:opacity-50"
        >
          Back to login
        </LinkPayload>
      </div>
    </>
  ) : (
    <>
      <div
        className="text-3xl uppercase font-bold"
        dangerouslySetInnerHTML={{ __html: successMessageTitle }}
      />
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: successMessageDesc }}
      />
    </>
  );
};
