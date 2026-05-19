export type PrinterType = 'laser' | 'ink';
export type PrinterStatusType = 'online' | 'warning' | 'critical' | 'offline';

interface BasePrinter {
  id: number;
  model: string;
  sector: string;
  ip: string;
  unit: string;
  status: PrinterStatusType;
}

export interface LaserPrinter extends BasePrinter {
  type: 'laser';
  toner: number;
  pagesRemaining: number;
}

export interface InkPrinter extends BasePrinter {
  type: 'ink';
  black: number;
  cyan: number;
  magenta: number;
  yellow: number;
}

export type Printer = LaserPrinter | InkPrinter;

export interface PrinterStatusData {
  online: boolean;
  status: PrinterStatusType;
  toner?: number;
  black?: number;
  cyan?: number;
  magenta?: number;
  yellow?: number;
  pagesRemaining?: number;
  serial?: string;
  firmware?: string;
  paperStatus?: string;
  lastUpdate: string;
}

export interface HistoryPoint {
  day: string;
  value: number;
}

export interface InkHistoryPoint {
  day: string;
  black: number;
  cyan: number;
  magenta: number;
  yellow: number;
}

export interface UsagePoint {
  day: string;
  pages: number;
}
