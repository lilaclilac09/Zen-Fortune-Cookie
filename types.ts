
export interface Stats {
  totalPoints: number;
  tapCount: number;
}

export interface Fortune {
  text: string;
  points: number;
}

export type CookieState = 'intact' | 'cracking' | 'broken' | 'resetting';

export interface HandData {
  present: boolean;
  distance: number; // Distance between hand centers
  isPulling: boolean;
}
