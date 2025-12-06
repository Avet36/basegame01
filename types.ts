export interface Prize {
  id: string;
  text: string;
  color: string;
  textColor: string;
}

export interface WheelState {
  isSpinning: boolean;
  rotation: number;
  winner: Prize | null;
  winningMessage: string | null;
}

export interface ThemeResponse {
  prizes: { text: string }[];
}