import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useAccount } from 'wagmi';
import { parseEther, decodeEventLog } from 'viem';
import { RED_PACKET_ABI, getRedPacketAddress } from '../contracts/RedPacketABI';
import './CreateRedPacket.css';

export function CreateRedPacket() {
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState('');
  const [isRandom, setIsRandom] = useState(false);
  const [redPacketId, setRedPacketId] = useState<string | null>(null);
  const chainId = useChainId();
  const { address } = useAccount();

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // 从交易回执的事件日志中解析红包ID
  useEffect(() => {
    if (isConfirmed && receipt && address) {
      try {
        // 遍历所有日志，找到属于当前用户的 Created 事件
        for (const log of receipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: RED_PACKET_ABI,
              data: log.data,
              topics: log.topics,
            });

            // 找到 Created 事件，并且 creator 是当前用户
            if (decoded.eventName === 'Created') {
              const creator = decoded.args.creator;
              const packetId = decoded.args.id;

              // 确保是当前用户创建的红包（地址不区分大小写）
              if (creator?.toLowerCase() === address.toLowerCase() && packetId) {
                setRedPacketId(packetId.toString());
                console.log('红包创建成功，ID:', packetId.toString());
                break;
              }
            }
          } catch {
            // 跳过无法解码的日志
            continue;
          }
        }
      } catch (error) {
        console.error('解析红包ID失败:', error);
      }
    }
  }, [isConfirmed, receipt, address]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !count) {
      alert('请填写所有字段');
      return;
    }

    try {
      writeContract({
        address: getRedPacketAddress(chainId),
        abi: RED_PACKET_ABI,
        functionName: 'create',
        args: [Number(count), isRandom],
        value: parseEther(amount),
      });
    } catch (error) {
      console.error('创建红包失败:', error);
      alert('创建红包失败，请检查钱包余额');
    }
  };

  return (
    <div className="create-red-packet">
      <div className="red-packet-envelope">
        <div className="envelope-top">
          <div className="fortune-text">恭喜发财</div>
        </div>
        <div className="envelope-body">
          <form onSubmit={handleCreate} className="red-packet-form">
            <div className="form-group">
              <label>红包金额 (ETH)</label>
              <input
                type="number"
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label>红包个数</label>
              <input
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="5"
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isRandom}
                  onChange={(e) => setIsRandom(e.target.checked)}
                />
                <span>拼手气红包</span>
              </label>
              <p className="hint">
                {isRandom ? '随机金额，考验运气' : '等额红包，人人平等'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending || isConfirming}
              className="submit-button"
            >
              {isPending
                ? '等待确认...'
                : isConfirming
                ? '处理中...'
                : '发红包'}
            </button>

            {isConfirmed && redPacketId && (
              <div className="success-message">
                <div>✅ 红包创建成功！</div>
                <div className="red-packet-id">
                  <span>红包ID：</span>
                  <span className="id-value">{redPacketId}</span>
                  <button
                    type="button"
                    className="copy-id-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(redPacketId);
                      alert('红包ID已复制到剪贴板');
                    }}
                  >
                    复制
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
