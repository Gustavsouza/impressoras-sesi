import type { PrinterStatusData } from '../../types/printer';

/**
 * In production: fetches https://{ip}/hp/device/InternalPages/Index?id=SuppliesStatus
 * Uses DOMParser to extract:
 *   #BlackCartridge1-Header_Level      → toner %
 *   #BlackCartridge1-EstimatedPagesRemaining → pagesRemaining
 *   #BlackCartridge1-SupplyState       → OK|Low|Very Low → status
 *   #BlackCartridge1-SerialNumber      → serial
 */
export async function getHPE42540Status(ip: string): Promise<PrinterStatusData> {
  // Mock — replace with real fetch when proxy/backend is available
  await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));
  void ip;

  return {
    online: true,
    status: 'online',
    toner: 78,
    pagesRemaining: 4200,
    serial: '16908309',
    firmware: '2.41.0',
    lastUpdate: new Date().toISOString(),
  };
}
