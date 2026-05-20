import type { PrinterStatusData } from '../../types/printer';

// Endpoint: https://{ip}/DevMgmt/ConsumableConfigDyn.xml
// Relevant fields (dd: namespace):
//   dd:ConsumablePercentageLevelRemaining → toner %
//   dd:ConsumableEstimatedPages           → pages remaining
//   dd:MeasuredQuantityState              → ok | low | veryLow

function parseXmlField(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<(?:dd:)?${tag}[^>]*>([^<]+)<`));
  return m?.[1]?.trim() ?? null;
}

export async function getHP4003Status(ip: string): Promise<PrinterStatusData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`https://${ip}/DevMgmt/ConsumableConfigDyn.xml`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const toner = parseInt(parseXmlField(xml, 'ConsumablePercentageLevelRemaining') ?? '0', 10);
    const pagesRemaining = parseInt(parseXmlField(xml, 'ConsumableEstimatedPages') ?? '0', 10);
    const state = (parseXmlField(xml, 'MeasuredQuantityState') ?? 'ok').toLowerCase();

    const status =
      state.includes('verylow') || state === 'very_low' ? 'critical' :
      state === 'low' ? 'warning' : 'online';

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
