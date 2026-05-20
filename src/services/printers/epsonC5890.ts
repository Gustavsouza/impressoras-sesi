import type { PrinterStatusData } from '../../types/printer';

// Endpoint: https://{ip}/PRESENTATION/ADVANCED/INFO_PRTINFO/TOP
// Ink levels are encoded as inline styles on level-bar divs:
//   style="background:linear-gradient(to top, #000000 0%, #000000 32%, #FFFFFF 32%, ...)"
// The repeated percentage (32%) gives the fill level.
// Order in DOM: BK, Y, M, C

function extractGradientPct(style: string | null): number {
  if (!style) return 0;
  const m = style.match(/linear-gradient\([^,]+,\s*#\w+ 0%,\s*#\w+ (\d+)%/);
  return m ? parseInt(m[1], 10) : 0;
}

function inkStatus(levels: number[]): 'online' | 'warning' | 'critical' {
  const min = Math.min(...levels);
  if (min <= 10) return 'critical';
  if (min <= 25) return 'warning';
  return 'online';
}

export async function getEpsonC5890Status(ip: string): Promise<PrinterStatusData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(
      `https://${ip}/PRESENTATION/ADVANCED/INFO_PRTINFO/TOP`,
      { signal: controller.signal },
    );
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const bars = Array.from(doc.querySelectorAll('[style*="linear-gradient"]'));
    const levels = bars.slice(0, 4).map(el =>
      extractGradientPct((el as HTMLElement).getAttribute('style')),
    );

    const [black = 0, yellow = 0, magenta = 0, cyan = 0] = levels;

    return {
      online: true,
      status: inkStatus([black, cyan, magenta, yellow]),
      black,
      cyan,
      magenta,
      yellow,
      lastUpdate: new Date().toISOString(),
    };
  } catch {
    clearTimeout(timer);
    throw new Error('unreachable');
  }
}
