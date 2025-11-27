import { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { CreateRedPacket } from './components/CreateRedPacket';
import { ClaimRedPacket } from './components/ClaimRedPacket';
import { EventHistory } from './components/EventHistory';
import './App.css';

type TabType = 'create' | 'claim';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('create');

  return (
    <div className="app">
      <WalletConnect />

      <div className="container">
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-icon">🧧</span>
            Web3 红包
            <span className="title-icon">🧧</span>
          </h1>
          <p className="app-subtitle">基于区块链的去中心化红包应用</p>
        </header>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <span className="tab-icon">📤</span>
            发红包
          </button>
          <button
            className={`tab ${activeTab === 'claim' ? 'active' : ''}`}
            onClick={() => setActiveTab('claim')}
          >
            <span className="tab-icon">📥</span>
            抢红包
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'create' ? (
            <>
              <CreateRedPacket />
              <EventHistory eventType="created" />
            </>
          ) : (
            <>
              <ClaimRedPacket />
              <EventHistory eventType="claimed" />
            </>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>Powered by Ethereum & Web3</p>
      </footer>
    </div>
  );
}

export default App;
