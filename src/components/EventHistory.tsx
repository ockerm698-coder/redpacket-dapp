import { useEffect, useState, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import {
  createSubgraphClient,
  GET_CREATED_EVENTS,
  GET_CLAIMED_EVENTS,
  type CreatedEvent as SubgraphCreatedEvent,
  type ClaimedEvent as SubgraphClaimedEvent,
  type CreatedEventsResponse,
  type ClaimedEventsResponse,
} from '../lib/subgraph';
import { getExplorerUrl } from '../lib/utils';
import './EventHistory.css';

// 复制功能组件
function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
      <span className="monospace" style={{ wordBreak: 'break-all', flex: 1 }}>
        {id}
      </span>
      <button
        onClick={handleCopy}
        style={{
          background: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          padding: '4px 10px',
          color: copied ? '#22c55e' : '#3b82f6',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          whiteSpace: 'nowrap',
          fontFamily: 'monospace',
          minWidth: '20px'
        }}
        title="复制红包ID"
      >
        {copied ? '✓' : '⧉'}
      </button>
    </div>
  );
}

interface CreatedEvent {
  id: bigint;
  creator: string;
  amount: bigint;
  count: number;
  isRandom: boolean;
  blockNumber: bigint;
  transactionHash: string;
}

interface ClaimedEvent {
  id: bigint;
  claimer: string;
  amount: bigint;
  creator: string;
  total: bigint;
  blockNumber: bigint;
  transactionHash: string;
}

interface EventHistoryProps {
  eventType: 'created' | 'claimed';
}

export function EventHistory({ eventType }: EventHistoryProps) {
  const { address } = useAccount();
  const chainId = useChainId();

  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
  const [claimedEvents, setClaimedEvents] = useState<ClaimedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEventsInternal = useCallback(async () => {
    if (!address || !chainId) return;

    setIsLoading(true);

    try {
      const client = createSubgraphClient(chainId);

      // ---- 获取 Created 事件 ----
      const createdData = await client.request<CreatedEventsResponse>(
        GET_CREATED_EVENTS,
        {
          creator: address.toLowerCase(),
          first: 100,
          skip: 0,
        }
      );
      console.log("createdData :", createdData);
      const parsedCreated = createdData.createds.map((e: SubgraphCreatedEvent) => ({
        id: BigInt(e.internal_id || '0'),
        creator: e.creator,
        amount: BigInt(e.amount || '0'),
        count: Number(e.count),
        isRandom: Boolean(e.isRandom),
        blockNumber: BigInt(e.blockNumber || '0'),
        transactionHash: e.transactionHash
      }));

      setCreatedEvents(parsedCreated);

      // ---- 获取 Claimed 事件 ----
      const claimedData = await client.request<ClaimedEventsResponse>(
        GET_CLAIMED_EVENTS,
        {
          claimer: address.toLowerCase(),
          first: 100,
          skip: 0,
        }
      );
      console.log("claimedData :", claimedData);
      const parsedClaimed = claimedData.claimeds.map((e: SubgraphClaimedEvent) => ({
        id: BigInt(e.internal_id || '0'),
        claimer: e.claimer,
        amount: BigInt(e.amount || '0'),
        creator: e.creator,
        total: BigInt(e.total || '0'),
        blockNumber: BigInt(e.blockNumber || '0'),
        transactionHash: e.transactionHash
      }));

      setClaimedEvents(parsedClaimed);

    } catch (err) {
      console.error('Subgraph 获取失败:', err);
      setCreatedEvents([]);
      setClaimedEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [address, chainId]);

  // 手动刷新（立即执行，不防抖）
  const handleRefresh = () => {
    fetchEventsInternal();
  };

  useEffect(() => {
    // 添加 500ms 防抖，避免频繁请求
    const timer = setTimeout(() => {
      fetchEventsInternal();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchEventsInternal]);

  if (isLoading) {
    return <div className="event-history loading">加载历史记录...</div>;
  }

  if (!address) {
    return (
      <div className="event-history empty">
        <p>请先连接钱包查看历史记录</p>
      </div>
    );
  }

  const eventsToShow =
    eventType === 'created' ? createdEvents : claimedEvents;

  if (eventsToShow.length === 0) {
    return (
      <div className="event-history empty">
        <p>暂无{eventType === 'created' ? '发送' : '领取'}记录</p>
      </div>
    );
  }

  return (
    <div className="event-history">
      <div className="history-header">
        <h3 className="history-title">
          {eventType === 'created' ? '📤 我发出的红包' : '📥 我领取的红包'}
        </h3>
        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? '刷新中...' : '刷新'}
        </button>
      </div>

      <div className="events-list">
        {eventType === 'created'
          ? createdEvents.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-header">
                  <span className="event-type">
                    {event.isRandom ? '🎲 拼手气' : '💰 等额'}
                  </span>
                  <span className="event-amount">
                    {formatEther(event.amount)} ETH
                  </span>
                </div>

                <div className="event-details">
                  <div className="detail-row">
                    <span>红包ID:</span>
                    <CopyableId id={event.id.toString()} />
                  </div>
                  <div className="detail-row">
                    <span>红包个数:</span>
                    <span>{event.count}</span>
                  </div>
                  <div className="detail-row">
                    <span>区块高度:</span>
                    <span>{event.blockNumber.toString()}</span>
                  </div>
                </div>

                <div className="event-tx">
                  <a
                    href={getExplorerUrl(chainId, event.transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    查看交易 ↗
                  </a>
                </div>
              </div>
            ))
          : claimedEvents.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-header claimed">
                  <span className="event-type">🎉 已领取</span>
                  <span className="event-amount highlight">
                    +{formatEther(event.amount)} ETH
                  </span>
                </div>

                <div className="event-details">
                  <div className="detail-row">
                    <span>红包ID:</span>
                    <CopyableId id={event.id.toString()} />
                  </div>
                  <div className="detail-row">
                    <span>总金额:</span>
                    <span>{formatEther(event.total)} ETH</span>
                  </div>
                  <div className="detail-row">
                    <span>区块高度:</span>
                    <span>{event.blockNumber.toString()}</span>
                  </div>
                </div>

                <div className="event-tx">
                  <a
                    href={getExplorerUrl(chainId, event.transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    查看交易 ↗
                  </a>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
