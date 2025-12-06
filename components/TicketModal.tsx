import React, { useState } from 'react';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { BASE_CHAIN_ID_HEX, USDC_CONTRACT_ADDRESS, TREASURY_WALLET_ADDRESS } from '../constants';

interface TicketModalProps {
  onClose: () => void;
  onBuy: (amount: number) => void;
  balance: number; // Current ticket balance
}

const TICKET_PRICE = 5; // USDC

// Minimal ERC20 ABI to support transfer
const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)"
];

const TicketModal: React.FC<TicketModalProps> = ({ onClose, onBuy, balance }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIncrement = () => {
    if (quantity < 10) setQuantity(q => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const switchToBaseNetwork = async (provider: any) => {
     try {
       await provider.send('wallet_switchEthereumChain', [{ chainId: BASE_CHAIN_ID_HEX }]);
     } catch (switchError: any) {
       // This error code indicates that the chain has not been added to MetaMask.
       if (switchError.code === 4902) {
         try {
           await provider.send('wallet_addEthereumChain', [
             {
               chainId: BASE_CHAIN_ID_HEX,
               chainName: 'Base',
               rpcUrls: ['https://mainnet.base.org'],
               blockExplorerUrls: ['https://basescan.org'],
               nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
             },
           ]);
         } catch (addError) {
           throw new Error("Could not add Base network.");
         }
       } else {
         throw switchError;
       }
     }
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    setStatus("Initializing...");
    setError(null);

    if (typeof window === 'undefined' || !(window as any).ethereum) {
        setError("No wallet found.");
        setIsProcessing(false);
        return;
    }

    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      setStatus("Checking network...");
      // Check Chain ID
      const network = await provider.getNetwork();
      // Use explicit check for Base Chain ID (8453)
      if (Number(network.chainId) !== 8453) {
        setStatus("Switching to Base...");
        await switchToBaseNetwork((window as any).ethereum); // Use window.ethereum for switching
        // Re-initialize provider/signer after switch might be needed in some cases, but usually ok
      }

      const usdcContract = new Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, signer);
      
      // Calculate amount: Price * Quantity * 10^6 (USDC decimals)
      // Note: hardcoding 6 decimals for USDC on Base
      const amount = parseUnits((TICKET_PRICE * quantity).toString(), 6);

      setStatus(`Please confirm ${quantity * TICKET_PRICE} USDC transaction...`);

      // Execute Transfer
      const tx = await usdcContract.transfer(TREASURY_WALLET_ADDRESS, amount);
      
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait(); // Wait for 1 block confirmation

      setStatus("Success!");
      // Success
      onBuy(quantity);
      
    } catch (err: any) {
      console.error(err);
      if (err.code === 'ACTION_REJECTED') {
          setError("Transaction rejected by user.");
      } else {
          setError(err.message || "Transaction failed.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1e1e2f] border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-bounce-in">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎟️</span> Buy Tickets
          </h2>
          <button 
            onClick={!isProcessing ? onClose : undefined}
            className={`text-gray-400 hover:text-white transition-colors ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-white">{balance} Tickets</p>
          </div>

          <div className="bg-[#2a2a3e] rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 font-medium">Quantity</span>
              <span className="text-blue-400 font-bold">{TICKET_PRICE} USDC / ticket</span>
            </div>
            
            <div className="flex items-center justify-between bg-black/30 rounded-lg p-1">
              <button 
                onClick={handleDecrement}
                className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md text-white font-bold transition-colors disabled:opacity-50"
                disabled={quantity <= 1 || isProcessing}
              >
                -
              </button>
              <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
              <button 
                onClick={handleIncrement}
                className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md text-white font-bold transition-colors disabled:opacity-50"
                disabled={quantity >= 10 || isProcessing}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-gray-400">Total Cost</span>
            <div className="text-right">
                <span className="text-2xl font-bold text-green-400 block">{quantity * TICKET_PRICE} USDC</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">on BASE Network</span>
            </div>
          </div>

          {error && (
             <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
               {error}
             </div>
          )}

          {status && !error && (
              <div className="mb-4 text-xs text-blue-300 text-center animate-pulse">
                  {status}
              </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className={`
              w-full py-4 rounded-xl text-lg font-bold uppercase tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all
              ${isProcessing 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] text-white'}
            `}
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>Buy {quantity} Ticket{quantity > 1 ? 's' : ''}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;