"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import {
  TrackingEvent,
  ClickEvent,
  ScrollEvent,
  PageViewEvent,
  UserTrackingContextType,
} from "@/types/tracking";
import { useTrackingGraphQL } from "@/hooks/useTrackingGraphQL";

const UserTrackingContext = createContext<UserTrackingContextType | undefined>(
  undefined
);

interface UserTrackingProviderProps {
  children: React.ReactNode;
  saveToServer?: boolean; // Option to save to server
}

export function UserTrackingProvider({
  children,
  saveToServer = true,
}: UserTrackingProviderProps) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  const [previousPath, setPreviousPath] = useState<string | undefined>();
  const pathname = usePathname();
  const lastPageViewRef = useRef<string | null>(null);

  // GraphQL hooks for saving to server
  const {
    saveTrackingEvent,
    trackPageView: savePageView,
    trackClick: saveClick,
  } = useTrackingGraphQL();

  // Function to add event to list and output to console
  const trackEvent = useCallback(
    async (event: TrackingEvent) => {
      if (!isTracking) {
        return;
      }

      // Save to local state
      setEvents((prev) => [...prev, event]);

      // Save to server if enabled
      if (saveToServer) {
        try {
          await saveTrackingEvent(event);

          // Additional actions for different event types
          if (event.type === "pageview") {
            await savePageView(event.data.path, document.title);
          } else if (event.type === "click" && event.data.element) {
            await saveClick(
              event.data.path,
              event.data.element,
              event.data.coordinates?.x || 0,
              event.data.coordinates?.y || 0,
              event.data.elementId,
              event.data.elementClass
            );
          }
        } catch (error) {
          console.error("Failed to save event to server:", error);
        }
      }
    },
    [isTracking, saveToServer, saveTrackingEvent, savePageView, saveClick]
  );

  // Track clicks
  const trackClick = useCallback(
    (element: HTMLElement, event: MouseEvent) => {
      const clickEvent: ClickEvent = {
        type: "click",
        timestamp: Date.now(),
        data: {
          element: element.tagName.toLowerCase(),
          elementId: element.id || undefined,
          elementClass: element.className || undefined,
          coordinates: {
            x: event.clientX,
            y: event.clientY,
          },
          path: pathname,
        },
      };

      trackEvent(clickEvent);
    },
    [pathname, trackEvent]
  );

  // Track scrolling
  const trackScroll = useCallback(
    (scrollData: Omit<ScrollEvent["data"], "path">) => {
      const scrollEvent: ScrollEvent = {
        type: "scroll",
        timestamp: Date.now(),
        data: {
          ...scrollData,
          path: pathname,
        },
      };

      trackEvent(scrollEvent);
    },
    [pathname, trackEvent]
  );

  // Track page transitions (stable function)
  const trackPageView = useCallback(
    (path: string, prevPath?: string) => {
      // Check if not duplicate event
      if (lastPageViewRef.current === path) {
        return;
      }

      try {
        const pageViewEvent: PageViewEvent = {
          type: "pageview",
          timestamp: Date.now(),
          data: {
            path,
            previousPath: prevPath,
            referrer:
              (typeof document !== "undefined" && document.referrer) ||
              undefined,
            userAgent:
              (typeof navigator !== "undefined" && navigator.userAgent) ||
              "Unknown",
            timestamp: Date.now(),
          },
        };

        lastPageViewRef.current = path;
        trackEvent(pageViewEvent);
      } catch (error) {
        console.error("Error creating pageview event:", error);
      }
    },
    [trackEvent]
  );

  // Automatic page transition tracking
  useEffect(() => {
    if (pathname && pathname !== lastPageViewRef.current) {
      // Add small delay to ensure document is ready
      const timer = setTimeout(() => {
        trackPageView(pathname, previousPath);
        setPreviousPath(pathname);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath, trackPageView]);

  // Global click listener
  useEffect(() => {
    if (!isTracking) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target) {
        trackClick(target, event);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isTracking, trackClick]);

  // Global scroll listener with throttling
  useEffect(() => {
    if (!isTracking) return;

    let lastScrollY = 0;
    let lastScrollX = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const scrollX = window.scrollX;

          // Determine scroll direction
          let direction: "up" | "down" | "left" | "right" = "down";

          if (scrollY > lastScrollY) {
            direction = "down";
          } else if (scrollY < lastScrollY) {
            direction = "up";
          } else if (scrollX > lastScrollX) {
            direction = "right";
          } else if (scrollX < lastScrollX) {
            direction = "left";
          }

          // Calculate scroll percentage
          const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const percentage =
            documentHeight > 0
              ? Math.round((scrollY / documentHeight) * 100)
              : 0;

          trackScroll({
            scrollY,
            scrollX,
            direction,
            percentage,
          });

          lastScrollY = scrollY;
          lastScrollX = scrollX;
          ticking = false;
        });

        ticking = true;
      }
    };

    // Throttle scroll events - increase delay to reduce frequency
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 200); // Reduce frequency to 5 times per second
    };

    // Add listener to both window and document for better coverage
    window.addEventListener("scroll", throttledScroll, { passive: true });
    document.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      document.removeEventListener("scroll", throttledScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isTracking, trackScroll]);

  const contextValue: UserTrackingContextType = {
    trackEvent,
    trackClick,
    trackScroll,
    trackPageView,
    events,
    isTracking,
    setIsTracking,
  };

  return (
    <UserTrackingContext.Provider value={contextValue}>
      {children}
    </UserTrackingContext.Provider>
  );
}

export function useUserTracking() {
  const context = useContext(UserTrackingContext);
  if (context === undefined) {
    throw new Error(
      "useUserTracking must be used within a UserTrackingProvider"
    );
  }
  return context;
}
