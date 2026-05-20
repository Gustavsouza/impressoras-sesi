import { useState } from 'react';

const STORAGE_KEY = 'sesi_on_network';

export function useNetworkDetection() {
  const [onCorporateNetwork, setOnCorporateNetwork] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true',
  );

  const toggleNetwork = () =>
    setOnCorporateNetwork(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });

  return { onCorporateNetwork, toggleNetwork };
}
