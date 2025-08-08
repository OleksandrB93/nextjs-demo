declare global {
  interface Window {
    VANTA?: {
      BIRDS?: (opts: Record<string, unknown>) => { destroy: () => void };
    };
  }
}

export {};
