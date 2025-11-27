# 🧧 Web3 红包 DApp

基于以太坊区块链的去中心化红包应用，支持等额红包和拼手气红包。

![Tech Stack](https://img.shields.io/badge/React-19.2-blue)
![Wagmi](https://img.shields.io/badge/Wagmi-2.x-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-yellow)

## ✨ 功能特性

- 🔐 **钱包连接**: 使用 RainbowKit 支持多种钱包连接，自动显示 ENS 名称和头像
- 📤 **发红包**:
  - 支持等额红包（平均分配）
  - 支持拼手气红包（随机金额）
  - 实时交易状态反馈
- 📥 **抢红包**:
  - 通过红包 ID 查询红包信息
  - 实时显示红包进度和剩余金额
  - 一键领取红包
- 📊 **历史记录**:
  - 查看我的发送记录
  - 查看我的领取记录
  - 使用 The Graph 高效索引链上事件
- 🌐 **多链支持**:
  - 支持 Ethereum 主网
  - 支持 Sepolia 测试网
  - 自动适配当前连接的网络
- 🎨 **精美 UI**:
  - 中国传统红包风格
  - 科技感十足的动画效果
  - 响应式设计，支持移动端

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm 或 yarn
- MetaMask 或其他 Web3 钱包

### 安装

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd redpacket-dapp

# 安装依赖
npm install
```

### 配置

#### 1. 创建环境变量文件

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

#### 2. 配置 WalletConnect Project ID

编辑 `.env` 文件，设置你的 WalletConnect Project ID：

```env
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

**获取 WalletConnect Project ID:**
1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 创建新项目
3. 复制 Project ID 并粘贴到 `.env` 文件中

#### 3. 配置 The Graph Subgraph URLs

本项目使用 The Graph 来索引和查询区块链事件。编辑 `.env` 文件，设置 Subgraph URLs：

```env
VITE_SUBGRAPH_URL_SEPOLIA=https://api.studio.thegraph.com/query/YOUR_QUERY_ID/redpacket-sepolia/version/latest
VITE_SUBGRAPH_URL_MAINNET=https://api.studio.thegraph.com/query/YOUR_QUERY_ID/redpacket-mainnet/version/latest
```

**部署 Subgraph 步骤:**

1. 进入 `../red-packet-subgraph` 目录
2. 安装 Graph CLI: `npm install -g @graphprotocol/graph-cli`
3. 登录 The Graph Studio: `graph auth --studio <YOUR_DEPLOY_KEY>`
4. 部署到 Sepolia: `graph deploy --studio redpacket-sepolia`
5. 部署到主网: `graph deploy --studio redpacket-mainnet`
6. 复制生成的查询 URL 并粘贴到 `.env` 文件中

更多信息请访问 [The Graph 文档](https://thegraph.com/docs/)

#### 4. 配置多链支持（可选）

如果你需要部署到其他网络，可以在 `src/contracts/RedPacketABI.ts` 中添加新的链配置：

```typescript
export const RED_PACKET_ADDRESSES: Record<number, `0x${string}`> = {
  1: '0x...', // Ethereum Mainnet 合约地址
  11155111: '0x2e9a6f87A12797F6b97ae0b901b5871EE575AE8f', // Sepolia 测试网合约地址
  // 添加其他链...
};
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

### 构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📦 部署到 Cloudflare Pages

### 方法一: 通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages > Create a project
3. 连接你的 Git 仓库
4. 配置构建设置:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
5. **配置环境变量**（重要！）
   - 在项目设置中，进入 "Settings" > "Environment variables"
   - 添加以下环境变量：
     - `VITE_WALLETCONNECT_PROJECT_ID`: 你的 WalletConnect Project ID
     - `VITE_SUBGRAPH_URL_SEPOLIA`: Sepolia Subgraph URL
     - `VITE_SUBGRAPH_URL_MAINNET`: Mainnet Subgraph URL（可选）
6. 点击 "Save and Deploy"

### 方法二: 使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
npm run build
wrangler pages deploy dist --project-name=redpacket-dapp
```

## 🛠 技术栈

### 前端框架
- **React 19.2**: 现代化的 UI 库
- **TypeScript**: 类型安全的 JavaScript
- **Vite**: 快速的构建工具

### Web3 集成
- **Wagmi 2.x**: React Hooks for Ethereum
- **Viem**: TypeScript 以太坊接口
- **RainbowKit**: 优雅的钱包连接 UI
- **TanStack Query**: 数据获取和缓存

### 数据索引
- **The Graph**: 去中心化的区块链数据索引协议
- **GraphQL**: 高效的数据查询语言
- **Subgraph**: 自定义索引红包事件数据

### 智能合约
- **RedPacket.sol**: 红包核心逻辑合约
  - **Sepolia 测试网**: `0x2e9a6f87A12797F6b97ae0b901b5871EE575AE8f`
  - **Ethereum 主网**: 待部署
  - 支持等额和随机红包
  - 基于事件的历史记录查询

### 部署平台
- **Cloudflare Pages**: 全球 CDN 加速，零配置部署

## 📁 项目结构

```
redpacket-dapp/
├── src/
│   ├── components/          # React 组件
│   │   ├── WalletConnect.tsx    # 钱包连接
│   │   ├── CreateRedPacket.tsx  # 发红包
│   │   ├── ClaimRedPacket.tsx   # 抢红包
│   │   └── EventHistory.tsx     # 历史记录（使用 Subgraph）
│   ├── contracts/           # 合约 ABI 和配置
│   │   └── RedPacketABI.ts      # ABI + 多链地址配置
│   ├── lib/                 # 工具库
│   │   ├── subgraph.ts          # The Graph 客户端和查询
│   │   └── utils.ts             # 工具函数
│   ├── wagmi.ts            # Wagmi 多链配置
│   ├── App.tsx             # 主应用
│   └── main.tsx            # 入口文件
├── public/
│   └── _headers            # Cloudflare Pages 头部配置
└── vite.config.ts          # Vite 配置（优化构建）
```

## 🔧 合约交互

### 发红包
```typescript
// 创建红包
await writeContract({
  address: RED_PACKET_ADDRESS,
  abi: RED_PACKET_ABI,
  functionName: 'create',
  args: [count, isRandom],  // count: 数量, isRandom: 是否随机
  value: parseEther(amount), // 红包总金额
});
```

### 抢红包
```typescript
// 领取红包
await writeContract({
  address: RED_PACKET_ADDRESS,
  abi: RED_PACKET_ABI,
  functionName: 'claim',
  args: [redPacketId],  // 红包 ID
});
```

### 查询红包信息
```typescript
// 读取红包详情
const packetData = await readContract({
  address: RED_PACKET_ADDRESS,
  abi: RED_PACKET_ABI,
  functionName: 'getPacket',
  args: [redPacketId],
});
```

## 🎯 使用说明

1. **连接钱包**
   - 点击右上角的连接钱包按钮
   - 选择你的钱包（MetaMask、WalletConnect 等）
   - 确认连接

2. **发红包**
   - 切换到"发红包"标签
   - 输入红包金额（ETH）
   - 输入红包个数
   - 选择红包类型（等额/拼手气）
   - 点击"发红包"并确认交易
   - 记录红包 ID 分享给朋友

3. **抢红包**
   - 切换到"抢红包"标签
   - 输入红包 ID 并点击查询
   - 查看红包信息
   - 点击"抢红包"按钮
   - 确认交易即可领取

4. **查看历史**
   - 在各自标签下方查看历史记录
   - 发红包记录显示你创建的所有红包
   - 抢红包记录显示你领取的所有红包

## 🐛 常见问题

**Q: 为什么无法连接钱包？**
A: 请确保已安装 MetaMask 或其他 Web3 钱包，并且钱包已解锁。

**Q: 项目启动时提示环境变量未设置？**
A: 请确保已创建 `.env` 文件并配置了所有必需的环境变量。参考 `.env.example` 文件。

**Q: 为什么历史记录不显示？**
A: 请检查 `.env` 文件中的 Subgraph URL 是否正确配置，并确保已部署对应的 Subgraph。

**Q: 交易一直处于等待状态？**
A: 请检查钱包中是否有足够的 Gas 费用，并确认交易。

**Q: 如何获取红包 ID？**
A: 发红包成功后，可以在交易记录或历史记录中找到红包 ID。

**Q: 可以领取自己发的红包吗？**
A: 可以，合约不限制创建者领取自己的红包。

**Q: 如何切换到其他网络？**
A: 在钱包中切换网络即可，应用会自动适配当前连接的网络。

## 🔒 环境变量安全

**重要提示：**
- ✅ `.env` 文件已添加到 `.gitignore`，不会被提交到 Git
- ✅ 使用 `.env.example` 作为模板，只包含示例值
- ✅ 所有敏感信息通过环境变量管理
- ⚠️ **永远不要**将 `.env` 文件提交到 GitHub 或其他公共仓库
- ⚠️ 在 Cloudflare Pages 等部署平台上，通过平台的环境变量设置功能配置
- ℹ️ WalletConnect Project ID 是公开可见的，不属于敏感信息，但建议通过环境变量管理以便于多环境配置

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

---

**Made with ❤️ using Ethereum & Web3**
