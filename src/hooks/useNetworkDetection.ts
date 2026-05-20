import { useState, useEffect } from 'react';

// Subnets used by the corporate network
const CORPORATE_PREFIXES = ['10.50.8.', '10.40.8.'];

function gatherLocalIPs(): Promise<string[]> {
  return new Promise((resolve) => {
    const ips: string[] = [];
    let pc: RTCPeerConnection | null = null;

    try {
      pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          pc?.close();
          resolve(ips);
          return;
        }
        const m = event.candidate.candidate.match(
          /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/,
        );
        if (m && !ips.includes(m[1])) ips.push(m[1]);
      };

      pc.createOffer()
        .then(offer => pc!.setLocalDescription(offer))
        .catch(() => { pc?.close(); resolve(ips); });

      // Fallback: resolve after 3s even if gathering is still open
      setTimeout(() => { pc?.close(); resolve(ips); }, 3000);
    } catch {
      resolve(ips);
    }
  });
}

/**
 * Detects whether the browser is on the corporate network by inspecting
 * WebRTC ICE candidates for local IPs in the known corporate subnets.
 *
 * Returns:
 *   null  → still detecting
 *   true  → on corporate network
 *   false → outside corporate network
 */
export function useNetworkDetection() {
  const [onCorporateNetwork, setOnCorporateNetwork] = useState<boolean | null>(null);

  useEffect(() => {
    gatherLocalIPs().then(ips => {
      setOnCorporateNetwork(
        ips.some(ip => CORPORATE_PREFIXES.some(prefix => ip.startsWith(prefix))),
      );
    });
  }, []);

  return { onCorporateNetwork };
}
