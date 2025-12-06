import React from 'react';
import { Prize } from '../types';

interface WinnerModalProps {
  winner: Prize;
  message: string | null;
  onClose: () => void;
  loadingMessage: boolean;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, message, onClose, loadingMessage }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1e1e2f] border border-gray-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl transform transition-transform animate-pop-in flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

        <div 
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-2xl relative z-10 ring-4 ring-white/10" 
          style={{ backgroundColor: winner.color }}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-black/10"></div>
          🎁
        </div>

        <h2 className="text-4xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2 drop-shadow-sm">
          You Won!
        </h2>
        
        <p className="text-3xl font-bold text-white mb-8 tracking-tight">
          {winner.text}
        </p>

        <div className="bg-black/30 border border-white/5 p-4 rounded-xl w-full mb-6 min-h-[80px] flex items-center justify-center backdrop-blur-sm">
          {loadingMessage ? (
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-150"></span>
            </div>
          ) : (
            <p className="italic text-gray-300 text-sm font-medium leading-relaxed">
              "{message}"
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg mb-4 text-lg"
        >
          Collect Prize
        </button>
        
        <button
          onClick={onClose}
          className="text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;