import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId, useAccount } from 'wagmi';
import { RED_PACKET_ABI, getRedPacketAddress } from '../contracts/RedPacketABI';
import { formatEther } from 'viem';
import {
  createSubgraphClient,
  CHECK_PACKET_STATUS,
  CHECK_USER_CLAIMED,
  type CheckPacketStatusResponse,
  type CheckClaimedResponse
} from '../lib/subgraph';
import './ClaimRedPacket.css';

export function ClaimRedPacket() {
  const [redPacketId, setRedPacketId] = useState('');
  const [queryTrigger, setQueryTrigger] = useState(0);
  const [debouncedId, setDebouncedId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const chainId = useChainId();
  const { address } = useAccount();

  // 300ms 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      if (queryTrigger > 0 && redPacketId) {
        setDebouncedId(redPacketId);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [queryTrigger, redPacketId]);

  // 读取红包信息
  const { data: packetData, isLoading: isLoadingPacket } = useReadContract({
    address: getRedPacketAddress(chainId),
    abi: RED_PACKET_ABI,
    functionName: 'getPacket',
    args: debouncedId ? [BigInt(debouncedId)] : undefined,
    scopeKey: `query-${queryTrigger}`,
    query: {
      enabled: !!debouncedId,
      staleTime: 0, // 数据立即过期，每次都重新查询
    },
  });

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // 领取成功后自动刷新红包信息
  useEffect(() => {
    if (isConfirmed && redPacketId) {
      // 延迟一下让区块确认
      const timer = setTimeout(() => {
        setQueryTrigger(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, redPacketId]);

  const handleQuery = () => {
    if (!redPacketId) {
      alert('请输入红包ID');
      return;
    }
    // 增加触发计数，允许连续查询同一个ID
    setQueryTrigger(prev => prev + 1);
  };

  const handleClaim = async () => {
    if (!redPacketId) {
      alert('请输入红包ID');
      return;
    }

    if (!address) {
      alert('请先连接钱包');
      return;
    }

    try {
      setIsChecking(true);

      const client = createSubgraphClient(chainId);

      // 1. 【优先级最高】检查红包是否已经被抢完
      const statusData = await client.request<CheckPacketStatusResponse>(CHECK_PACKET_STATUS, {
        packetId: redPacketId,
      });

      if (statusData.createds && statusData.createds.length > 0) {
        const totalCount = Number(statusData.createds[0].count);
        const claimedCount = statusData.claimeds ? statusData.claimeds.length : 0;

        if (claimedCount >= totalCount) {
          const createTime = new Date(Number(statusData.createds[0].blockTimestamp) * 1000).toLocaleString();
          alert(
            `红包已经被抢完了！\n` +
            `总个数: ${totalCount}\n` +
            `已领取: ${claimedCount}\n` +
            `创建时间: ${createTime}`
          );
          setIsChecking(false);
          return;
        }
      }

      // 2. 检查是否已经领取过
      const data = await client.request<CheckClaimedResponse>(CHECK_USER_CLAIMED, {
        packetId: redPacketId,
        userAddress: address.toLowerCase(),
      });

      // 3. 如果已经领取过，提示用户
      if (data.claimeds && data.claimeds.length > 0) {
        const claimedAmount = formatEther(BigInt(data.claimeds[0].amount));
        const claimedTime = new Date(Number(data.claimeds[0].blockTimestamp) * 1000).toLocaleString();
        alert(
          `你已经领取过这个红包了！\n` +
          `领取金额: ${claimedAmount} ETH\n` +
          `领取时间: ${claimedTime}`
        );
        setIsChecking(false);
        return;
      }

      // 4. 没有领取过，继续领取流程
      setIsChecking(false);
      writeContract({
        address: getRedPacketAddress(chainId),
        abi: RED_PACKET_ABI,
        functionName: 'claim',
        args: [BigInt(redPacketId)],
      });
    } catch (error) {
      console.error('检查或领取红包失败:', error);
      setIsChecking(false);
      // 如果 Subgraph 查询失败，询问用户是否继续
      if (confirm('无法查询领取记录，是否继续领取红包？')) {
        writeContract({
          address: getRedPacketAddress(chainId),
          abi: RED_PACKET_ABI,
          functionName: 'claim',
          args: [BigInt(redPacketId)],
        });
      }
    }
  };

  const packetInfo = packetData
    ? {
        creator: packetData[0],
        count: Number(packetData[1]),
        claimed: Number(packetData[2]),
        isRandom: packetData[3],
        total: packetData[4],
        remain: packetData[5],
      }
    : null;

  return (
    <div className="claim-red-packet">
      <div className="red-packet-envelope claim-envelope">
        <div className="envelope-top">
          <div className="fortune-text">大吉大利</div>
        </div>
        <div className="envelope-body">
          <div className="claim-form">
            <div className="form-group">
              <label>红包ID</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={redPacketId}
                  onChange={(e) => setRedPacketId(e.target.value)}
                  placeholder="输入红包ID查询"
                />
                <button onClick={handleQuery} className="query-button">
                  查询
                </button>
              </div>
            </div>

            {isLoadingPacket && (
              <div className="loading-message">正在加载红包信息...</div>
            )}

            {packetInfo && (
              <div className="packet-info">
                <div className="info-card">
                  <div className="info-row">
                    <span className="label">红包类型:</span>
                    <span className="value">
                      {packetInfo.isRandom ? '🎲 拼手气' : '💰 等额'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">总金额:</span>
                    <span className="value gold">
                      {formatEther(packetInfo.total)} ETH
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">剩余金额:</span>
                    <span className="value">
                      {formatEther(packetInfo.remain)} ETH
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">进度:</span>
                    <span className="value">
                      {packetInfo.claimed} / {packetInfo.count}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(packetInfo.claimed / packetInfo.count) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleClaim}
                  disabled={
                    isChecking ||
                    isPending ||
                    isConfirming ||
                    packetInfo.claimed >= packetInfo.count
                  }
                  className="claim-button"
                >
                  {isChecking
                    ? '检查领取记录...'
                    : isPending
                    ? '等待确认...'
                    : isConfirming
                    ? '领取中...'
                    : packetInfo.claimed >= packetInfo.count
                    ? '红包已抢完'
                    : '🧧 抢红包'}
                </button>

                {isConfirmed && (
                  <div className="success-message">
                    🎉 恭喜发财，红包领取成功！
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
