import React from 'react';

interface ControlsProps {
  onSpin: () => void;
  isSpinning: boolean;
  walletAddress: string | null;
  tickets: number;
  onConnectWallet: () => void;
  onDisconnect: () => void;
  onBuyTickets: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  onSpin, 
  isSpinning, 
  walletAddress,
  tickets,
  onConnectWallet,
  onDisconnect,
  onBuyTickets
}) => {
  return (
    <div className="w-full max-w-md flex flex-col gap-2 md:gap-4">
      
      {/* Wallet Status / Connect Button */}
      {!walletAddress ? (
        <button
          onClick={onConnectWallet}
          className="w-full py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold uppercase tracking-wider shadow-lg transform transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center gap-2"
        >
          <span>🔗</span> Connect Wallet
        </button>
      ) : (
        <div className="flex flex-col gap-2 md:gap-3">
           {/* Connected Status Card */}
           <div className="flex items-center justify-between bg-black/20 border border-green-500/30 rounded-xl p-2 md:p-3 backdrop-blur-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-0.5">Wallet</span>
                        <span className="text-green-400 font-mono text-xs md:text-sm font-bold truncate max-w-[120px] md:max-w-none">
                        {walletAddress}
                        </span>
                    </div>
                </div>
                <button 
                onClick={onDisconnect}
                className="ml-2 px-2 py-1.5 md:px-3 md:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[10px] md:text-xs font-bold rounded-lg transition-colors border border-red-500/20 whitespace-nowrap"
                >
                EXIT
                </button>
            </div>

            {/* Ticket Counter & Buy Button */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex-1 bg-[#2a2a3e] border border-gray-700 rounded-xl p-2 md:p-3 flex items-center justify-between h-12 md:h-auto">
                 <div className="flex items-center gap-2">
                    <span className="text-xl md:text-2xl">🎟️</span>
                    <div className="flex flex-col justify-center">
                      <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold leading-none">Tickets</span>
                      <span className="text-white font-bold text-base md:text-lg leading-none mt-1">{tickets}</span>
                    </div>
                 </div>
              </div>
              <button
                onClick={onBuyTickets}
                disabled={isSpinning}
                className="bg-blue-600 hover:bg-blue-500 text-white p-0 w-12 h-12 md:w-auto md:h-auto md:p-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex md:flex-col items-center justify-center min-w-[48px] md:min-w-[80px]"
              >
                <span className="hidden md:inline text-xs uppercase opacity-80">Buy</span>
                <span className="text-xl md:text-lg leading-none md:mt-0">+</span>
              </button>
            </div>

          {/* Spin Button */}
          <button
            onClick={onSpin}
            disabled={isSpinning || tickets === 0}
            className={`
              w-full py-3 md:py-4 rounded-xl text-xl md:text-2xl font-black uppercase tracking-wider shadow-lg transform transition-all relative overflow-hidden
              ${isSpinning || tickets === 0
                ? 'bg-gray-700 cursor-not-allowed opacity-50 text-gray-400' 
                : 'bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 hover:shadow-red-500/50 active:scale-95 text-white'}
            `}
          >
            {isSpinning ? '...' : tickets === 0 ? 'Buy Tickets' : 'SPIN!'}
            
            {/* Ticket Cost Badge on Button if active */}
            {!isSpinning && tickets > 0 && (
               <div className="absolute top-1 right-1 md:top-2 md:right-2 text-[9px] md:text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-white/80 font-medium">
                 -1
               </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Controls;