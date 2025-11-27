/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  readonly VITE_SUBGRAPH_URL_SEPOLIA: string;
  readonly VITE_SUBGRAPH_URL_MAINNET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
