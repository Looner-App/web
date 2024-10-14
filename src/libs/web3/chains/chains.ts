import { baseSepolia, base } from 'wagmi/chains';
import { merge } from 'lodash';
import { Chain } from './types';
import {
  BASENAME_RESOLVER_ADDRESS,
  BASE_SEPOLIA_BASENAME_RESOLVER_ADDRESS,
} from 'thirdweb/extensions/ens';

export type { Chain };

export const baseSepoliaChain: Chain = merge(baseSepolia, {
  /// insert custom fields here
  custom: {
    resolverAddress: BASE_SEPOLIA_BASENAME_RESOLVER_ADDRESS,
  },
});

export const baseChain: Chain = merge(base, {
  /// insert custom fields here
  custom: {
    resolverAddress: BASENAME_RESOLVER_ADDRESS,
  },
});
