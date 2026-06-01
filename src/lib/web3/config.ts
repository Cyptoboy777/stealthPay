import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'viem';

export const fhenixHelium = {
  id: 8008135,
  name: 'Fhenix Helium',
  nativeCurrency: { name: 'tFHE', symbol: 'tFHE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.helium.fhenix.zone'] },
    public: { http: ['https://api.helium.fhenix.zone'] },
  },
  blockExplorers: {
    default: { name: 'Fhenix Explorer', url: 'https://explorer.helium.fhenix.zone' },
  },
  testnet: true,
} as const satisfies Chain;

export const wagmiConfig = getDefaultConfig({
  appName: 'StealthPay',
  projectId: 'STEALTHPAY_FHENIX_BUILDATHON', // Replace with real WalletConnect ID if needed in production
  chains: [fhenixHelium],
  ssr: true,
});
