'use client';

import { LinkPayload } from '@/components/link';
import { getCountries, mergeStyle } from '@/libs/helper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';

type Inputs = {
  recaptchaResponse?: string | null;
  name: string;
  email: string;
  address: string;
  instagram: string;
  country: string;
  password: string;
  confirmPassword: string;
  invitationReferralCode: string;
};

export interface IFormRegister
  extends React.FormHTMLAttributes<HTMLFormElement> {
  data?: {
    title?: string;
    linkLogin?: string;
    linkRedirect?: string;
  };
}

export const FormRegister = ({ data, ...props }: IFormRegister) => {
  const title = data?.title || `<h1>Create Account</h1>`;
  let linkLogin = data?.linkLogin || `/login`;
  const linkRedirect = data?.linkRedirect;

  if (linkRedirect) {
    linkLogin += `?redirect=${linkRedirect}`;
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const countries = getCountries();
  const recaptchaRef: React.LegacyRef<ReCAPTCHA> = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState(``);
  const [isError, setIsError] = useState(false);

  const autoLogin = async (email: string, password: string) => {
    try {
      const request = await fetch(`/api/user/login`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify({ email, password }),
      });

      if (request.status >= 200 && request.status <= 299) {
        setTimeout(() => {
          if (linkRedirect) {
            router.push(linkRedirect);
          }

          router.refresh();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (recaptchaRef.current) {
      data.recaptchaResponse = await recaptchaRef.current.executeAsync();
    }

    try {
      const request = await fetch(`/api/users/register`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(data),
      });

      const result = await request.json();
      setMessage(result.message);

      if (request.status >= 200 && request.status <= 299) {
        setIsError(false);

        await autoLogin(data.email, data.password);
      } else {
        setIsError(true);
      }

      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const queryParamsFromSearchParams = searchParams.get(`referral`);
    if (queryParamsFromSearchParams) {
      setValue(`invitationReferralCode`, queryParamsFromSearchParams);
    }
  }, [searchParams, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} {...props}>
        <div
          className="text-3xl uppercase mb-10 font-black"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <div className="flex flex-col space-y-6">
          <div>
            <label>
              <span className="text-sm">Name</span>
              <input type="text" className="form-input" {...register(`name`)} />
            </label>
          </div>

          <div>
            <label>
              <span className="text-sm">Email</span>
              <input
                type="email"
                className="form-input"
                {...register(`email`)}
              />
            </label>
          </div>

          <div>
            <label>
              <span className="text-sm">Instagram</span>
              <input
                type="text"
                className="form-input"
                {...register(`instagram`)}
              />
            </label>
          </div>

          <div>
            <label>
              <span className="text-sm">Country</span>
              <select className="form-select" {...register(`country`)}>
                <option value="">-</option>
                {countries.map((country, _i) => (
                  <option key={_i}>{country.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              <span className="text-sm">Referral Code</span>
              <input
                type="text"
                className="form-input"
                {...register(`invitationReferralCode`)}
              />
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
            {siteKey && (
              <div className="mb-4">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  size="invisible"
                  sitekey={siteKey}
                />

                <small className="text-xs">
                  This site is protected by reCAPTCHA and the Google{` `}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    className="underline underline-offset-2 decoration-from-font"
                  >
                    {` `}
                    Privacy Policy
                  </a>
                  {` `}
                  and{` `}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    className="underline underline-offset-2 decoration-from-font"
                  >
                    Term of Service
                  </a>
                  {` `}
                  apply
                </small>
              </div>
            )}

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

      <div className="flex mt-10 flex-col space-y-4 items-center text-lg font-medium">
        <LinkPayload
          href={linkLogin}
          className="transition hocustive:opacity-50"
        >
          Have an account? Login
        </LinkPayload>
      </div>
    </>
  );
};
