import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Prize } from './types';
import { DEFAULT_PRIZES, WHEEL_COLORS, SPIN_DURATION_MS } from './constants';
import { generateWinningMessage } from './services/geminiService';
import GridGame from './components/GridGame';
import Controls from './components/Controls';
import WinnerModal from './components/WinnerModal';
import WalletModal from './components/WalletModal';
import TicketModal from './components/TicketModal';
import HistoryModal from './components/HistoryModal';

// Configuration for the "Rigged" mechanics
const TICKET_PRICE = 5; // USDC
const GUARANTEED_WIN_THRESHOLD = 350; // USDC

// Define History Item Type locally
interface HistoryItem {
  prize: Prize;
  timestamp: string;
}

const App: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  
  // Grid Animation State
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const animationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [winningMessage, setWinningMessage] = useState<string | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState<boolean>(false);
  
  // Wallet & Ticket State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [tickets, setTickets] = useState<number>(0);
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);

  // History State
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [winHistory, setWinHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gemini_game_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Hidden state to track total spend for the "pity timer"
  const [totalSpent, setTotalSpent] = useState<number>(() => {
    const saved = localStorage.getItem('gemini_game_spent');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (animationInterval.current) clearInterval(animationInterval.current);
    };
  }, []);

  // Persist spend to local storage
  useEffect(() => {
    localStorage.setItem('gemini_game_spent', totalSpent.toString());
  }, [totalSpent]);

  // Persist history to local storage
  useEffect(() => {
    localStorage.setItem('gemini_game_history', JSON.stringify(winHistory));
  }, [winHistory]);

  const handleConnectWallet = (address: string) => {
    setWalletAddress(address);
    setTickets(0); // Reset tickets on new connection
    setShowWalletModal(false);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    setTickets(0);
  };

  const handleBuyTickets = (amount: number) => {
    setTickets(prev => prev + amount);
    setShowTicketModal(false);
  };

  const handleSpin = useCallback(() => {
    if (isSpinning || !walletAddress) return;

    if (tickets <= 0) {
      setShowTicketModal(true);
      return;
    }

    // Deduct ticket
    setTickets(prev => prev - 1);

    // Increment Spend logic
    const currentTotalSpent = totalSpent + TICKET_PRICE;
    setTotalSpent(currentTotalSpent);

    // Reset winner state
    setWinner(null);
    setWinningMessage(null);
    setIsSpinning(true);
    setActiveIndex(null);

    // --- DETERMINE WINNER (RIGGED LOGIC) ---
    
    // Identify Loss Indices (Empty or Try Again)
    const lossIndices: number[] = [];
    const winIndices: number[] = [];

    prizes.forEach((prize, index) => {
      if (prize.text.toLowerCase().includes('empty') || prize.text.toLowerCase().includes('try again')) {
        lossIndices.push(index);
      } else {
        winIndices.push(index);
      }
    });

    let winningIndex: number;

    if (currentTotalSpent >= GUARANTEED_WIN_THRESHOLD) {
      // FORCE WIN: Threshold reached
      winningIndex = winIndices[Math.floor(Math.random() * winIndices.length)];
      // Reset the spend counter after a win
      setTotalSpent(0); 
    } else {
      // FORCE LOSS: Threshold not reached
      winningIndex = lossIndices[Math.floor(Math.random() * lossIndices.length)];
    }

    const actualWinner = prizes[winningIndex];

    // 2. Start Animation
    let elapsedTime = 0;
    const intervalTime = 100;

    animationInterval.current = setInterval(() => {
      elapsedTime += intervalTime;
      const randomIdx = Math.floor(Math.random() * prizes.length);
      setActiveIndex(randomIdx);

      if (elapsedTime >= SPIN_DURATION_MS) {
        if (animationInterval.current) clearInterval(animationInterval.current);
        setActiveIndex(winningIndex);
        setTimeout(() => {
          handleWin(actualWinner);
        }, 500);
      }
    }, intervalTime);

  }, [isSpinning, prizes, walletAddress, tickets, totalSpent]);

  const handleWin = (wonPrize: Prize) => {
    setIsSpinning(false);
    setWinner(wonPrize);
    
    const isLoss = wonPrize.text.toLowerCase().includes('empty') || wonPrize.text.toLowerCase().includes('try again');

    if (!isLoss) {
      // Add to history
      const newHistoryItem: HistoryItem = {
        prize: wonPrize,
        timestamp: new Date().toISOString()
      };
      setWinHistory(prev => [newHistoryItem, ...prev]);
    }

    if (isLoss) {
      setWinningMessage("Better luck next time!");
    } else {
      setIsLoadingMessage(true);
      generateWinningMessage(wonPrize.text)
        .then(msg => setWinningMessage(msg))
        .catch(() => setWinningMessage("Congrats!"))
        .finally(() => setIsLoadingMessage(false));
    }
  };

  return (
    <div className="h-[100dvh] w-full relative flex flex-col items-center justify-between overflow-hidden font-sans bg-gray-900 selection:bg-pink-500 selection:text-white pt-2 pb-2 md:pt-6 md:pb-6">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] z-0"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Header with History Button */}
      <header className="flex-shrink-0 w-full px-4 relative z-20 animate-fade-in flex items-center justify-center">
        
        {/* Title Group */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-tight">
            LUCKY GRID
          </h1>
          <p className="hidden md:block text-gray-200 text-sm mt-3 font-semibold tracking-wide uppercase bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
            Spin the cubes!
          </p>
        </div>

        {/* Absolute Positioned History Button */}
        <button 
          onClick={() => setShowHistoryModal(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-105 active:scale-95 transition-all shadow-lg group"
          aria-label="View Prize History"
        >
          <span className="text-2xl md:text-3xl group-hover:rotate-12 transition-transform">🎁</span>
        </button>
      </header>

      {/* Grid Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 min-h-0 w-full px-4">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square bg-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
         
         <GridGame 
            prizes={prizes} 
            activeIndex={activeIndex}
            isSpinning={isSpinning}
         />
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 relative z-10 w-full max-w-md flex justify-center pb-2 px-4">
        <Controls 
          onSpin={handleSpin} 
          onConnectWallet={() => setShowWalletModal(true)}
          onDisconnect={handleDisconnectWallet}
          onBuyTickets={() => setShowTicketModal(true)}
          walletAddress={walletAddress}
          tickets={tickets}
          isSpinning={isSpinning}
        />
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 text-gray-500 text-[10px] md:text-xs relative z-10 font-medium pb-1 opacity-70">
        Powered by Gemini AI
      </footer>

      {/* Modals */}
      {showWalletModal && (
        <WalletModal 
          onClose={() => setShowWalletModal(false)}
          onConnect={handleConnectWallet}
        />
      )}

      {showTicketModal && (
        <TicketModal
          balance={tickets}
          onClose={() => setShowTicketModal(false)}
          onBuy={handleBuyTickets}
        />
      )}

      {showHistoryModal && (
        <HistoryModal
          history={winHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {winner && (
        <WinnerModal 
          winner={winner} 
          message={winningMessage} 
          loadingMessage={isLoadingMessage}
          onClose={() => setWinner(null)} 
        />
      )}
    </div>
  );
};

export default App;