import type { Printer, PrinterStatusData } from '../../types/printer';
import { getHP4003Status } from './hp4003';
import { getHPE42540Status } from './hpE42540';
import { getEpsonC5890Status } from './epsonC5890';

export async function getPrinterStatus(printer: Printer): Promise<PrinterStatusData> {
  try {
    switch (printer.model) {
      case 'HP 4003':
        return await getHP4003Status(printer.ip);
      case 'HP E42540':
        return await getHPE42540Status(printer.ip);
      case 'EPSON C5890':
        return await getEpsonC5890Status(printer.ip);
      default:
        throw new Error(`Modelo não suportado: ${printer.model}`);
    }
  } catch {
    return {
      online: false,
      status: 'offline',
      lastUpdate: new Date().toISOString(),
    };
  }
}
