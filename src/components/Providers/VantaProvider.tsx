"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function VantaProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [vantaInstance, setVantaInstance] = useState<any>(null);

  const isDark = theme === "dark";

  // Helper function to get CSS variable value
  const getCSSVariable = (variableName: string): string => {
    if (typeof window === "undefined") return "";
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  };

  // Helper function to convert CSS color to hex number
  const cssColorToHex = (cssColor: string): number => {
    if (!cssColor) return 0x000000;

    // Create a temporary element to convert CSS color to hex
    const temp = document.createElement("div");
    temp.style.color = cssColor;
    document.body.appendChild(temp);
    const computedColor = getComputedStyle(temp).color;
    document.body.removeChild(temp);

    // Convert rgb/rgba to hex
    const rgbMatch = computedColor.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
    );
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return (r << 16) | (g << 8) | b;
    }

    return 0x000000; // fallback
  };

  useEffect(() => {
    let isMounted = true;
    let localInstance: any;

    // Ensure running only on client, after the element is mounted
    if (typeof window === "undefined" || !containerRef.current) return;

    (async () => {
      // Wait for both global THREE and VANTA.BIRDS from CDN
      const waitForGlobals = async (): Promise<any | null> => {
        const maxAttempts = 40;
        const delayMs = 100;
        for (let i = 0; i < maxAttempts; i += 1) {
          const hasThree = Boolean((window as any)?.THREE);
          const birds = (window as any)?.VANTA?.BIRDS;
          if (hasThree && birds) return birds;
          await new Promise((res) => setTimeout(res, delayMs));
        }
        return null;
      };

      const birdsFactory = await waitForGlobals();
      if (!birdsFactory || !isMounted || !containerRef.current) return;

      // Get theme-based colors from CSS variables
      const backgroundColor = isDark
        ? cssColorToHex(getCSSVariable("--background"))
        : cssColorToHex(getCSSVariable("--background"));

      const primaryColor = isDark
        ? cssColorToHex(getCSSVariable("--primary"))
        : cssColorToHex(getCSSVariable("--primary"));

      const accentColor = isDark
        ? cssColorToHex(getCSSVariable("--accent"))
        : cssColorToHex(getCSSVariable("--accent"));

      localInstance = birdsFactory({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: backgroundColor,
        backgroundAlpha: isDark ? 0.2 : 0.2,
        color1: primaryColor,
        color2: accentColor,
        colorMode: "varianceGradient",
      });

      setVantaInstance(localInstance);
    })();

    return () => {
      isMounted = false;
      try {
        if (localInstance) localInstance.destroy();
        if (vantaInstance && vantaInstance !== localInstance)
          vantaInstance.destroy();
      } catch {
        // no-op cleanup
      }
    };
    // Intentionally run only once for mount/unmount lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed w-full h-screen overflow-y-hidden overflow-x-hidden" ref={containerRef}>
      {children}
    </div>
  );
}
