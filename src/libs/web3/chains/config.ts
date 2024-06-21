import { reduce, merge } from 'lodash';
import { baseSepoliaChain, baseChain, Chain } from './chains';

export type { Chain };

export const mainnets = [baseChain];
export const testnets = [baseSepoliaChain];

export const allowedChains = (
  process.env.NEXT_PUBLIC_TESTNET_MODE === `1` ? testnets : mainnets
) as [Chain, ...Chain[]];

export const allowedChainsConfig = reduce(
  allowedChains,
  (acc, chain: Chain) =>
    merge(acc, {
      [chain.id]: chain,
    }),
  {} as { [key: number]: Chain },
);

export const thirdwebChains = allowedChains.map((chain) => ({
  name: chain.name,
  id: chain.id,
  rpc: chain.rpcUrls.default.http[0],
  nativeCurrency: chain.nativeCurrency,
  testnet: !!chain.testnet as true, /// PR: https://github.com/thirdweb-dev/js/pull/3338/files,
  blockExplorers: chain.blockExplorers?.default
    ? [
        {
          name: chain.blockExplorers.default.name!,
          url: chain.blockExplorers.default.url!,
          apiUrl: chain.blockExplorers.default.apiUrl!,
        },
      ]
    : [],
}));
