import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// 从环境变量获取 WalletConnect Project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'VITE_WALLETCONNECT_PROJECT_ID is not set. Please check your .env file.'
  );
}

export const config = getDefaultConfig({
  appName: 'Red Packet DApp',
  projectId,
  chains: [sepolia, mainnet],
  ssr: false, // 对于 Cloudflare Pages 设置为 false
});
