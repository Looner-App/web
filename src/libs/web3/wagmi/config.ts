import { reduce, merge } from 'lodash';

import {
  Chain,
  allowedChains as chains,
  allowedChainsConfig,
} from '@/libs/web3/chains/config';

import {
  webSocket,
  http,
  fallback,
  Config,
  cookieStorage,
  createStorage,
  createConfig,
} from 'wagmi';
import { Transport } from 'viem';

export const transports = reduce(
  chains,
  (acc, chain: Chain) =>
    merge(acc, {
      [chain.id]: fallback([
        webSocket(allowedChainsConfig[chain.id].rpcUrls.default.webSocket?.[0]),
        http(allowedChainsConfig[chain.id].rpcUrls.default.http[0]),
      ]),
    }),
  {} as Record<keyof typeof chains, Transport>,
);

export const config: Config = createConfig({
  transports,
  chains,
  ssr: true,
  storage: createStorage({
    key: `looner-v1-${process.env.NODE_ENV === `production` ? `prod` : `dev`}-wallet`,
    storage: cookieStorage,
  }),
});

export { chains };

export default config;
