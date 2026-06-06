import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'StealthPay',
  projectId: 'STEALTHPAY_FHENIX_BUILDATHON', // Replace with real WalletConnect ID if needed in production
  chains: [arbitrumSepolia],
  ssr: true,
});
