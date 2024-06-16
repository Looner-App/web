'use client';

import { mergeStyle } from '@/libs/helper';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { User } from '@/types/payload-types';
import { useRouter } from 'next/navigation';

type Inputs = {
  id: string;
  name: string;
};

export interface IFormAccountSettings
  extends React.FormHTMLAttributes<HTMLFormElement> {
  data: {
    user: User;
  };
}

export const FormAccountSettings = ({
  data,
  ...props
}: IFormAccountSettings) => {
  const user = data.user;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  const [message, setMessage] = useState(``);
  const [isError, setIsError] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      data[`id`] = user.id;

      const request = await fetch(`/api/users`, {
        method: `PATCH`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(data),
      });

      const result = await request.json();

      if (request.status >= 200 && request.status <= 299) {
        setIsError(false);
        setMessage(result.message);

        router.refresh();
      } else {
        setIsError(true);
        setMessage(result.errors[0].message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <div className="flex flex-col space-y-6">
        <div>
          <label>
            <span className="text-sm">Name</span>
            <input
              type="text"
              className="form-input"
              defaultValue={user.name || ``}
              {...register(`name`)}
            />
          </label>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-jet-black text-fade-white border transition hocustive:bg-white hocustive:text-jet-black rounded uppercase font-bold text-lg w-full py-2 px-6 disabled:opacity-50"
          >
            Change
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
