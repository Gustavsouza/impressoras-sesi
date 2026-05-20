/**
 * Fetches a printer URL through proxy.php (XAMPP).
 * The PHP proxy adds the X-SESI-Proxy header so we can detect when it is
 * actually running (vs. the file being served statically on Vercel).
 * Throws if the proxy is unavailable or the request fails.
 */
export async function proxyFetch(url: string, timeoutMs = 8000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`./proxy.php?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
    });

    if (!res.headers.get('X-SESI-Proxy')) throw new Error('proxy-unavailable');
    if (!res.ok) throw new Error(`proxy-error:${res.status}`);

    return res.text();
  } finally {
    clearTimeout(timer);
  }
}
