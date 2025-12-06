import { Prize } from './types';

export const WHEEL_COLORS = [
  '#e94560', // Red/Pink
  '#0f3460', // Dark Blue
  '#533483', // Purple
  '#16213e', // Navy
  '#f5a623', // Orange
  '#22c55e', // Green
];

export const DEFAULT_PRIZES: Prize[] = [
  { id: '1', text: '0.2 SOL', color: WHEEL_COLORS[0], textColor: '#ffffff' },
  { id: '2', text: '50 USDC', color: WHEEL_COLORS[1], textColor: '#ffffff' },
  { id: '3', text: '0.5 BNB', color: WHEEL_COLORS[2], textColor: '#ffffff' },
  { id: '4', text: 'Empty :(', color: WHEEL_COLORS[3], textColor: '#ffffff' },
  { id: '5', text: '1 SOL', color: WHEEL_COLORS[4], textColor: '#000000' },
  { id: '6', text: '150 WCT', color: WHEEL_COLORS[5], textColor: '#ffffff' },
  { id: '7', text: '1 BNB', color: WHEEL_COLORS[0], textColor: '#ffffff' },
  { id: '8', text: '0.03 ETH', color: WHEEL_COLORS[2], textColor: '#ffffff' },
  { id: '9', text: 'Try Again', color: WHEEL_COLORS[3], textColor: '#ffffff' },
];

export const SPIN_DURATION_MS = 3000;
export const API_KEY_ERROR = "Please set process.env.API_KEY to use AI features.";

// Blockchain Config
export const BASE_CHAIN_ID = 8453; // 0x2105
export const BASE_CHAIN_ID_HEX = '0x2105';

export const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Wallet address to receive funds
export const TREASURY_WALLET_ADDRESS = '0xc9A658Aebf62a1Ef7dE6c3e34DF78e3075b308b8';