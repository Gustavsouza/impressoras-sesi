import type { PrinterStatusData } from '../../types/printer';
import { proxyFetch } from './proxyFetch';

// Endpoint: http://{ip}/PRESENTATION/ADVANCED/INFO_PRTINFO/TOP
// Ink levels encoded as inline gradient:
//   style="background:linear-gradient(to top, #000000 0%, #000000 32%, ...)"
// Order in DOM: BK, Y, M, C

function gradientPct(style: string | null): number {
  if (!style) return 0;
  return parseInt(style.match(/linear-gradient\([^,]+,\s*#\w+ 0%,\s*#\w+ (\d+)%/)?.[1] ?? '0', 10);
}

function inkStatus(levels: number[]): 'online' | 'warning' | 'critical' {
  const min = Math.min(...levels);
  return min <= 10 ? 'critical' : min <= 25 ? 'warning' : 'online';
}

export async function getEpsonC5890Status(ip: string): Promise<PrinterStatusData> {
  const html = await proxyFetch(`https://${ip}/PRESENTATION/ADVANCED/INFO_PRTINFO/TOP`);
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  const bars = Array.from(doc.querySelectorAll('[style*="linear-gradient"]'));
  const [black = 0, yellow = 0, magenta = 0, cyan = 0] =
    bars.slice(0, 4).map(el => gradientPct((el as HTMLElement).getAttribute('style')));

  return {
    online: true,
    status: inkStatus([black, cyan, magenta, yellow]),
    black, cyan, magenta, yellow,
    lastUpdate: new Date().toISOString(),
  };
}
