import React, { useState } from 'react';

interface WalletModalProps {
  onClose: () => void;
  onConnect: (address: string) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose, onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      setError("Wallet not found. Please open in Coinbase Wallet.");
      setIsConnecting(false);
      return;
    }

    try {
      // Direct request to the injected provider
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        onConnect(accounts[0]);
      } else {
        setError("No accounts found.");
      }
    } catch (err: any) {
      console.error("Connection failed:", err);
      if (err.code === 4001) {
        setError("You rejected the connection.");
      } else {
        setError(err.message || "Failed to connect.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1e1e2f] border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-bounce-in">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 text-3xl">
            🔗
          </div>
          
          <p className="text-center text-gray-300 mb-6 text-sm">
            Connect your wallet to buy tickets and verify winnings on the Base network.
          </p>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center break-words">
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`
              w-full py-4 rounded-xl text-lg font-bold uppercase tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all
              ${isConnecting
                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'}
            `}
          >
            {isConnecting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Connecting...
              </>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#151520] text-center border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Powered by Base Network
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;