import type { HistoryPoint, InkHistoryPoint, UsagePoint } from '../types/printer';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function generateTonerHistory(currentLevel: number): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  let level = Math.min(currentLevel + 14 + Math.random() * 8, 100);

  for (let i = 0; i < 7; i++) {
    if (i === 6) {
      points.push({ day: DAYS[i], value: currentLevel });
    } else {
      points.push({ day: DAYS[i], value: Math.round(level) });
      level = Math.max(currentLevel, level - (Math.random() * 2.5 + 0.5));
    }
  }

  return points;
}

export function generateInkHistory(current: {
  black: number;
  cyan: number;
  magenta: number;
  yellow: number;
}): InkHistoryPoint[] {
  const points: InkHistoryPoint[] = [];
  let bk = Math.min(current.black + 10, 100);
  let c = Math.min(current.cyan + 6, 100);
  let m = Math.min(current.magenta + 6, 100);
  let y = Math.min(current.yellow + 6, 100);

  for (let i = 0; i < 7; i++) {
    if (i === 6) {
      points.push({ day: DAYS[i], black: current.black, cyan: current.cyan, magenta: current.magenta, yellow: current.yellow });
    } else {
      points.push({ day: DAYS[i], black: Math.round(bk), cyan: Math.round(c), magenta: Math.round(m), yellow: Math.round(y) });
      bk = Math.max(current.black, bk - (Math.random() * 1.8 + 0.2));
      c  = Math.max(current.cyan,  c  - (Math.random() * 1.2 + 0.1));
      m  = Math.max(current.magenta, m - (Math.random() * 1.2 + 0.1));
      y  = Math.max(current.yellow,  y - (Math.random() * 1.2 + 0.1));
    }
  }

  return points;
}

export function generateWeeklyUsage(): UsagePoint[] {
  return DAYS.map(day => ({
    day,
    pages: Math.floor(Math.random() * 160) + 30,
  }));
}
