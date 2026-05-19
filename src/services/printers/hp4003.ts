import type { PrinterStatusData } from '../../types/printer';

/**
 * In production: fetches https://{ip}/DevMgmt/ConsumableConfigDyn.xml
 * Parses dd:ConsumablePercentageLevelRemaining, dd:ConsumableEstimatedPages,
 * dd:MeasuredQuantityState (ok→online, low→warning, veryLow→critical)
 */
export async function getHP4003Status(ip: string): Promise<PrinterStatusData> {
  // Mock — replace with real fetch when proxy/backend is available
  await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));
  void ip;

  return {
    online: true,
    status: 'online',
    toner: 50,
    pagesRemaining: 3150,
    serial: '16844852',
    firmware: '2.36.1',
    lastUpdate: new Date().toISOString(),
  };
}
