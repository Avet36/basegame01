import React from 'react';
import { Prize } from '../types';

interface HistoryItem {
  prize: Prize;
  timestamp: string;
}

interface HistoryModalProps {
  history: HistoryItem[];
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1e1e2f] border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-bounce-in flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-[#25253a]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎁</span> Your Winnings
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
              <span className="text-4xl opacity-50">🕸️</span>
              <p>No prizes won yet.</p>
              <p className="text-xs">Spin to win!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div 
                  key={`${item.prize.id}-${idx}`} 
                  className="flex items-center gap-4 bg-[#2a2a3e] p-3 rounded-xl border border-white/5 shadow-sm"
                >
                  {/* Color Dot/Icon */}
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-inner flex-shrink-0"
                    style={{ backgroundColor: item.prize.color }}
                  >
                    <span className="text-lg">🎁</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{item.prize.text}</p>
                    <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-[#151520]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;