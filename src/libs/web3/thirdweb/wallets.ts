import { createWallet, walletConnect, inAppWallet } from 'thirdweb/wallets';
import { thirdwebChains } from '../chains/config';

export const wallets = [
  createWallet(`io.metamask`),
  createWallet(`com.coinbase.wallet`, {
    appMetadata: {
      name: process.env.NEXT_PUBLIC_SITE_NAME!,
      url: process.env.NEXT_PUBLIC_SITE_URL!,
    },
    chains: thirdwebChains,
    walletConfig: {
      options: `smartWalletOnly`,
    },
    mobileConfig: {
      callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    },
  }),
  inAppWallet({
    auth: {
      options: [`email`, `google`, `telegram`],
    },
  }),
  walletConnect(),
];

export default wallets;
