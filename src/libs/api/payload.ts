import qs from 'qs';
import { removeTrailingSlash } from '@/libs/helper';

let backendUrl = process.env.NEXT_PUBLIC_PAYLOADCMS_URL;

export const get = async (
  endpoint: string,
  params = {},
  options: RequestInit | undefined = {},
) => {
  // Format endpoint url
  backendUrl = removeTrailingSlash(`${backendUrl}`);
  endpoint = removeTrailingSlash(endpoint);
  endpoint = `${backendUrl}/api/${endpoint}`;

  // Add query params
  endpoint = `${endpoint}${qs.stringify(params, { addQueryPrefix: true })}`;

  try {
    const result = await fetch(endpoint, {
      method: `GET`,
      headers: {
        'Content-Type': `application/json`,
      },
      ...options,
    });

    if (result.status >= 200 && result.status <= 299) {
      return result.json();
    } else {
      console.log(`Error (${result.status}) : ${endpoint}`);
    }
  } catch (error) {
    console.log(`Error function get() : ${endpoint}`);
    console.log(error);
  }

  return null;
};

export const fetchPayload = async (
  endpoint: string,
  method: `GET` | `POST` | `PUT` | `PATCH` | `DELETE`,
  options?: RequestInit,
) => {
  // Format endpoint url
  backendUrl = removeTrailingSlash(`${backendUrl}`);
  endpoint = removeTrailingSlash(endpoint);
  endpoint = `${backendUrl}/api/${endpoint}`;

  try {
    const result = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': `application/json`,
      },
      ...options,
    });

    return result;
  } catch (error) {
    console.log(`Error function fetchPayload() : ${method} ${endpoint}`);
    console.log(error);
  }

  return null;
};
