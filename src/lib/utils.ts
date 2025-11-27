// 获取区块浏览器 URL
export const getExplorerUrl = (
  chainId: number | undefined,
  txHash: string
): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io', // Ethereum Mainnet
    11155111: 'https://sepolia.etherscan.io', // Sepolia Testnet
  };

  const baseUrl = chainId && explorers[chainId] ? explorers[chainId] : explorers[11155111];
  return `${baseUrl}/tx/${txHash}`;
};

// 获取链的名称
export const getChainName = (chainId: number | undefined): string => {
  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    11155111: 'Sepolia',
  };

  return chainId && chainNames[chainId] ? chainNames[chainId] : 'Unknown';
};
