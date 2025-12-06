import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';

interface WalletModalProps {
  onClose: () => void;
  onConnect: (address: string) => void;
}

// SVG Icons
const MetaMaskLogo = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#E17726" d="M27.2 4.1L28.1 16.2L16 28L3.9 16.2L4.8 4.1C4.8 4.1 10.4 0.2 16 0.2C21.6 0.2 27.2 4.1 27.2 4.1Z"/>
    <path fill="#F5841F" d="M28.1 16.2L16 28L3.9 16.2L2.6 9.3C2.6 9.3 7.6 11.1 10.8 11.1C14 11.1 16 9.3 16 9.3C16 9.3 18 11.1 21.2 11.1C24.4 11.1 29.4 9.3 29.4 9.3L28.1 16.2Z"/>
    <path fill="#C0AC9D" d="M10.8 11.1C7.6 11.1 2.6 9.3 2.6 9.3L1.5 14.5L7.2 18.5L10.8 11.1Z"/>
    <path fill="#C0AC9D" d="M21.2 11.1C24.4 11.1 29.4 9.3 29.4 9.3L30.5 14.5L24.8 18.5L21.2 11.1Z"/>
    <path fill="#763D16" d="M7.2 18.5L10.8 11.1L12.9 19.5L7.2 18.5Z"/>
    <path fill="#763D16" d="M24.8 18.5L21.2 11.1L19.1 19.5L24.8 18.5Z"/>
  </svg>
);

const WalletConnectLogo = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 11.5C9.5 8.5 13.5 7.5 16 7.5C18.5 7.5 22.5 8.5 25.5 11.5L26.5 12.5L24 15L23 14C21 12 18 11 16 11C14 11 11 12 9 14L8 15L5.5 12.5L6.5 11.5Z" fill="#3B99FC"/>
    <path d="M9 14C11 12 14 11 16 11C18 11 21 12 23 14L16 21L9 14Z" fill="#3B99FC" opacity="0.5"/>
  </svg>
);

const TrustWalletLogo = () => (
   <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M16 2L3 7V14C3 22 8 28 16 30C24 28 29 22 29 14V7L16 2Z" fill="#3375BB"/>
     <path d="M16 6L25 10V14.5C25 20.5 21 24.5 16 26C11 24.5 7 20.5 7 14.5V10L16 6Z" fill="#ffffff"/>
   </svg>
);

const WALLETS = [
  { name: 'Browser Wallet', component: <MetaMaskLogo />, description: 'MetaMask, Trust, Coinbase, etc.' },
  { name: 'WalletConnect', component: <WalletConnectLogo />, description: 'Scan QR Code (Coming Soon)' },
];

const WalletModal: React.FC<WalletModalProps> = ({ onClose, onConnect }) => {
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectInjected = async () => {
    setConnectingWallet('Browser Wallet');
    setError(null);

    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setError("No wallet found. Please install MetaMask or Trust Wallet.");
      setConnectingWallet(null);
      return;
    }

    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts && accounts.length > 0) {
        onConnect(accounts[0]);
      } else {
        setError("No account found.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect.");
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleWalletClick = (walletName: string) => {
    if (walletName === 'Browser Wallet') {
      connectInjected();
    } else {
      // Stub for WC
      setConnectingWallet(walletName);
      setTimeout(() => {
        setError("WalletConnect is not configured in this demo.");
        setConnectingWallet(null);
      }, 1000);
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
        <div className="p-5">
          {connectingWallet ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300 font-medium">Connecting to {connectingWallet}...</p>
              <p className="text-gray-500 text-sm mt-2">Check your wallet extension</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {WALLETS.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleWalletClick(wallet.name)}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#2a2a3e] hover:bg-[#32324a] transition-all border border-transparent hover:border-gray-600 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {wallet.component}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-200 group-hover:text-white">{wallet.name}</div>
                      <div className="text-xs text-gray-500">{wallet.description}</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-green-400 transition-colors"></div>
                </button>
              ))}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#151520] text-center border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Supports Base Network (EVM)
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;