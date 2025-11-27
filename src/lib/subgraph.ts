import { GraphQLClient } from 'graphql-request';

// 从环境变量获取 Subgraph URLs
const SUBGRAPH_URL_MAINNET = import.meta.env.VITE_SUBGRAPH_URL_MAINNET;
const SUBGRAPH_URL_SEPOLIA = import.meta.env.VITE_SUBGRAPH_URL_SEPOLIA;

// 验证必需的环境变量
if (!SUBGRAPH_URL_SEPOLIA) {
  console.warn(
    'VITE_SUBGRAPH_URL_SEPOLIA is not set. History feature may not work properly.'
  );
}

// Subgraph URL 配置 - 多链支持
export const SUBGRAPH_URLS: Record<number, string> = {
  1: SUBGRAPH_URL_MAINNET || '', // Ethereum Mainnet
  11155111: SUBGRAPH_URL_SEPOLIA || '', // Sepolia Testnet
};

// 获取当前链的 Subgraph URL
export const getSubgraphUrl = (chainId: number | undefined): string => {
  if (!chainId || !SUBGRAPH_URLS[chainId]) {
    // 默认返回 Sepolia URL
    return SUBGRAPH_URLS[11155111];
  }
  return SUBGRAPH_URLS[chainId];
};

// 创建 GraphQL 客户端
export const createSubgraphClient = (chainId: number | undefined) => {
  const url = getSubgraphUrl(chainId);
  return new GraphQLClient(url);
};

// GraphQL 查询语句
export const GET_CREATED_EVENTS = `
  query GetCreatedEvents($creator: Bytes!, $first: Int!, $skip: Int!) {
    createds(
      where: { creator: $creator }
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      internal_id
      creator
      amount
      count
      isRandom
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_CLAIMED_EVENTS = `
  query GetClaimedEvents($claimer: Bytes!, $first: Int!, $skip: Int!) {
    claimeds(
      where: { claimer: $claimer }
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      internal_id
      claimer
      amount
      creator
      total
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// 检查红包状态（总数和已领取数）
export const CHECK_PACKET_STATUS = `
  query CheckPacketStatus($packetId: BigInt!) {
    createds(where: { internal_id: $packetId }) {
      id
      internal_id
      count
      blockTimestamp
    }
    claimeds(where: { internal_id: $packetId }) {
      id
    }
  }
`;

// 检查用户是否已经领取过某个红包
export const CHECK_USER_CLAIMED = `
  query CheckUserClaimed($packetId: BigInt!, $userAddress: Bytes!) {
    claimeds(
      where: {
        internal_id: $packetId,
        claimer: $userAddress
      }
    ) {
      id
      amount
      blockTimestamp
      transactionHash
    }
  }
`;

// TypeScript 类型定义
export interface CreatedEvent {
  id: string;
  internal_id: string;
  creator: string;
  amount: string;
  count: string;
  isRandom: boolean;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface ClaimedEvent {
  id: string;
  internal_id: string;
  claimer: string;
  amount: string;
  creator: string;
  total: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface CreatedEventsResponse {
  createds: CreatedEvent[];
}

export interface ClaimedEventsResponse {
  claimeds: ClaimedEvent[];
}

// 检查红包状态的响应
export interface CheckPacketStatusResponse {
  createds: {
    id: string;
    internal_id: string;
    count: string;
    blockTimestamp: string;
  }[];
  claimeds: {
    id: string;
  }[];
}

// 检查是否领取过的响应
export interface CheckClaimedResponse {
  claimeds: {
    id: string;
    amount: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
}
