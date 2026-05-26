import type { PrinterStatusData } from '../../types/printer';
import { proxyFetch } from './proxyFetch';

// Endpoint: http://{ip}/hp/device/InternalPages/Index?id=SuppliesStatus
// #BlackCartridge1-Header_Level            → "78%"
// #BlackCartridge1-EstimatedPagesRemaining → "4200"
// #BlackCartridge1-SupplyState             → "OK" | "Low" | "Very Low"

export async function getHPE42540Status(ip: string): Promise<PrinterStatusData> {
  const html = await proxyFetch(`https://${ip}/hp/device/InternalPages/Index?id=SuppliesStatus`);
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  const toner          = parseInt((doc.getElementById('BlackCartridge1-Header_Level')?.textContent            ?? '0').replace(/\D/g, ''), 10);
  const pagesRemaining = parseInt((doc.getElementById('BlackCartridge1-EstimatedPagesRemaining')?.textContent ?? '0').replace(/\D/g, ''), 10);
  const stateText      = (doc.getElementById('BlackCartridge1-SupplyState')?.textContent ?? 'OK').toLowerCase();

  const status =
    stateText.includes('very') ? 'critical' :
    stateText === 'low'        ? 'warning'  : 'online';

  return { online: true, status, toner, pagesRemaining, lastUpdate: new Date().toISOString() };
}
