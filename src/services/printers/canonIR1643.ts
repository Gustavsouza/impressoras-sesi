import type { PrinterStatusData } from '../../types/printer';
import { proxyFetch } from './proxyFetch';

// Endpoint: http://{ip}/portal_top.html (exige login — proxy.php autentica)
// #black (div.RemainingN) → linha da tabela; último <td> → "78%" ou "-%" (cartucho ilegível)
// #deviceErrorInfoModule <p> → mensagens de erro ("Não é possível estabelecer comunicação…")
// Não expõe páginas restantes: estimamos pelo rendimento do toner T06 (~20.500 págs).

const T06_YIELD = 20500;

export async function getCanonIR1643Status(ip: string): Promise<PrinterStatusData> {
  const html = await proxyFetch(`http://${ip}/portal_top.html`);
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  const row = doc.getElementById('black')?.closest('tr');
  if (!row) throw new Error('canon-sem-sessao'); // proxy devolveu a tela de login/erro

  const tonerText = row.querySelector('td:last-child')?.textContent ?? '';
  const toner     = /\d/.test(tonerText) ? parseInt(tonerText.replace(/\D/g, ''), 10) : 0;

  const hasError = Array.from(doc.querySelectorAll('#deviceErrorInfoModule p'))
    .some(p => !p.querySelector('a') && p.textContent?.trim());

  const status =
    hasError || toner <= 10 ? 'critical' :
    toner <= 25             ? 'warning'  : 'online';

  return {
    online: true, status, toner,
    pagesRemaining: Math.round(T06_YIELD * toner / 100),
    lastUpdate: new Date().toISOString(),
  };
}
