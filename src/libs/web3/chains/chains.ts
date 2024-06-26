import { baseSepolia, base } from 'wagmi/chains';
import { merge } from 'lodash';
import { Chain } from './types';

export type { Chain };

export const baseSepoliaChain: Chain = merge(baseSepolia, {
  /// insert custom fields here
});

export const baseChain: Chain = merge(base, {
  /// insert custom fields here
});
