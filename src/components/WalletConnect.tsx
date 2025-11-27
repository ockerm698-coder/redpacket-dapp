import { ConnectButton } from '@rainbow-me/rainbowkit';
import './WalletConnect.css';

export function WalletConnect() {
  return (
    <div className="wallet-connect">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button onClick={openConnectModal} className="custom-connect-button">
                      <span className="button-glow"></span>
                      <span className="button-icon">🔗</span>
                      <span className="button-text">连接钱包</span>
                      <span className="button-bg-animation"></span>
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} className="custom-connect-button wrong-network">
                      <span className="button-icon">⚠️</span>
                      <span className="button-text">错误网络</span>
                    </button>
                  );
                }

                return (
                  <div className="connected-wallet">
                    <button
                      onClick={openChainModal}
                      className="chain-button"
                      type="button"
                    >
                      <span className="chain-indicator"></span>
                      {chain.hasIcon && (
                        <div className="chain-icon">
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                            />
                          )}
                        </div>
                      )}
                      <span className="chain-name">{chain.name}</span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      className="account-button"
                      type="button"
                    >
                      {account.ensAvatar ? (
                        <div className="account-avatar">
                          <img
                            src={account.ensAvatar}
                            alt={account.displayName}
                          />
                        </div>
                      ) : (
                        <span className="account-icon">👤</span>
                      )}
                      <span className="account-address">{account.displayName}</span>
                      {account.displayBalance && (
                        <span className="account-balance">{account.displayBalance}</span>
                      )}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
