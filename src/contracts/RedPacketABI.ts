// 多链合约地址配置
export const RED_PACKET_ADDRESSES: Record<number, `0x${string}`> = {
  1: '0x0000000000000000000000000000000000000000', // Ethereum Mainnet - 待部署
  11155111: '0x681ddD24197358474BDD541d51a6424Ea5EcC494', // Sepolia Testnet
} as const;

// 获取当前链的合约地址
export const getRedPacketAddress = (chainId: number | undefined): `0x${string}` => {
  if (!chainId || !RED_PACKET_ADDRESSES[chainId]) {
    // 默认返回 Sepolia 地址
    return RED_PACKET_ADDRESSES[11155111];
  }
  return RED_PACKET_ADDRESSES[chainId];
};

// 向后兼容
export const RED_PACKET_ADDRESS = RED_PACKET_ADDRESSES[11155111];

export const RED_PACKET_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "total",
        "type": "uint256"
      }
    ],
    "name": "Claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "count",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isRandom",
        "type": "bool"
      }
    ],
    "name": "Created",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "claims",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_count",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "_isRandom",
        "type": "bool"
      }
    ],
    "name": "create",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getPacket",
    "outputs": [
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "count",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "claimed",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "isRandom",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "total",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "remain",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastPacketId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "packets",
    "outputs": [
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "count",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "claimed",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "isRandom",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "total",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "remain",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
