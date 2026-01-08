
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

// 调整：增大初始距离阈值。以前是 150，现在设为 280。
// 这样用户双手距离 10-15 厘米时就能锁定，不需要重叠。
export const GESTURE_THRESHOLD_START = 280; 
export const GESTURE_THRESHOLD_PULL = 550;  // 拉开的距离也相应调大
export const STORAGE_KEY = 'zen_fortune_stats';
