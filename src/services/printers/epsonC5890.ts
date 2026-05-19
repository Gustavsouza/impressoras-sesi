import type { PrinterStatusData } from '../../types/printer';

/**
 * In production: fetches https://{ip}/PRESENTATION/ADVANCED/INFO_PRTINFO/TOP
 * Ink levels are encoded in inline style:
 *   style='background:linear-gradient(to top, #000000 0%, #000000 32%, #FFFFFF 32%, ...)'
 * The percentage (32%) is extracted via regex.
 * Order in DOM: BK, Y, M, C
 */
export async function getEpsonC5890Status(ip: string): Promise<PrinterStatusData> {
  // Mock — replace with real fetch when proxy/backend is available
  await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));
  void ip;

  return {
    online: true,
    status: 'online',
    black: 32,
    cyan: 96,
    magenta: 1,
    yellow: 96,
    firmware: '07.67.DB15OA',
    paperStatus: 'Restante',
    lastUpdate: new Date().toISOString(),
  };
}
