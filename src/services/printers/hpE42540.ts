import type { PrinterStatusData } from '../../types/printer';

// Endpoint: https://{ip}/hp/device/InternalPages/Index?id=SuppliesStatus
// DOM elements used:
//   #BlackCartridge1-Header_Level            → "78%" → toner
//   #BlackCartridge1-EstimatedPagesRemaining → "4200"
//   #BlackCartridge1-SupplyState             → "OK" | "Low" | "Very Low"

export async function getHPE42540Status(ip: string): Promise<PrinterStatusData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(
      `https://${ip}/hp/device/InternalPages/Index?id=SuppliesStatus`,
      { signal: controller.signal },
    );
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const levelEl = doc.getElementById('BlackCartridge1-Header_Level');
    const pagesEl = doc.getElementById('BlackCartridge1-EstimatedPagesRemaining');
    const stateEl = doc.getElementById('BlackCartridge1-SupplyState');

    const toner = parseInt((levelEl?.textContent ?? '0').replace(/[^0-9]/g, ''), 10);
    const pagesRemaining = parseInt((pagesEl?.textContent ?? '0').replace(/[^0-9]/g, ''), 10);
    const stateText = (stateEl?.textContent ?? 'OK').toLowerCase();

    const status =
      stateText.includes('very') ? 'critical' :
      stateText === 'low' ? 'warning' : 'online';

    return {
      online: true,
      status,
      toner,
      pagesRemaining,
      lastUpdate: new Date().toISOString(),
    };
  } catch {
    clearTimeout(timer);
    throw new Error('unreachable');
  }
}
