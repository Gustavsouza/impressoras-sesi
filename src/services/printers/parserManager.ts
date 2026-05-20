import type { Printer, PrinterStatusData } from '../../types/printer';
import { getHP4003Status } from './hp4003';
import { getHPE42540Status } from './hpE42540';
import { getEpsonC5890Status } from './epsonC5890';

// Throws on any error — callers use Promise.allSettled and keep static data on rejection.
export async function getPrinterStatus(printer: Printer): Promise<PrinterStatusData> {
  switch (printer.model) {
    case 'HP 4003':    return getHP4003Status(printer.ip);
    case 'HP E42540':  return getHPE42540Status(printer.ip);
    case 'EPSON C5890': return getEpsonC5890Status(printer.ip);
    default: throw new Error(`Modelo não suportado: ${printer.model}`);
  }
}
