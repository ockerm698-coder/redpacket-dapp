import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { RED_PACKET_ABI, getRedPacketAddress } from '../contracts/RedPacketABI';
import './CreateRedPacket.css';

export function CreateRedPacket() {
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState('');
  const [isRandom, setIsRandom] = useState(false);
  const chainId = useChainId();

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

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

            {isConfirmed && (
              <div className="success-message">
                ✅ 红包发送成功！
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
