import type { PrinterStatusData } from '../../types/printer';
import { proxyFetch } from './proxyFetch';

// Endpoint: http://{ip}/DevMgmt/ConsumableConfigDyn.xml
// dd:ConsumablePercentageLevelRemaining → toner %
// dd:ConsumableEstimatedPages           → pages remaining
// dd:MeasuredQuantityState              → ok | low | veryLow

function xmlField(xml: string, tag: string): string | null {
  return xml.match(new RegExp(`<(?:dd:)?${tag}[^>]*>([^<]+)<`))?.[1]?.trim() ?? null;
}

export async function getHP4003Status(ip: string): Promise<PrinterStatusData> {
  const xml = await proxyFetch(`https://${ip}/DevMgmt/ConsumableConfigDyn.xml`);

  const toner          = parseInt(xmlField(xml, 'ConsumablePercentageLevelRemaining') ?? '0', 10);
  const pagesRemaining = parseInt(xmlField(xml, 'ConsumableEstimatedPages')           ?? '0', 10);
  const state          = (xmlField(xml, 'MeasuredQuantityState') ?? 'ok').toLowerCase();

  const status =
    state.includes('verylow') || state === 'very_low' ? 'critical' :
    state === 'low' ? 'warning' : 'online';

  return { online: true, status, toner, pagesRemaining, lastUpdate: new Date().toISOString() };
}
