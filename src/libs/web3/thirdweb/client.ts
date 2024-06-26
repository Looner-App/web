import { createThirdwebClient, CreateThirdwebClientOptions } from 'thirdweb';

export const client = (args: CreateThirdwebClientOptions) => {
  return createThirdwebClient(args);
};

export default client;
