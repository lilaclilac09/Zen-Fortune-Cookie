
import { Fortune } from './types';

export const FORTUNES: string[] = [
  "Persistence pays off! Keep going! 💪",
  "Today is your lucky day! ✨",
  "Believe in yourself, you can do it! 🌟",
  "A fresh start is coming your way. 🍃",
  "Your kindness will lead you to success. 🧡",
  "Great things take time. Be patient. ⏳",
  "Adventure awaits you around the corner. 🗺️",
  "You are stronger than you think! 🦁",
  "A smile is your best accessory. 😊",
  "Good news is on its way to you. 📩"
];

export const GESTURE_THRESHOLD_START = 250; // Increased from 150 to make it easier to "arm" the gesture
export const GESTURE_THRESHOLD_PULL = 500;  // Increased from 350 to give more satisfying pull range
export const STORAGE_KEY = 'zen_fortune_stats';
