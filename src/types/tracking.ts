export interface TrackingEvent {
  type: "click" | "scroll" | "pageview";
  timestamp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface ClickEvent extends TrackingEvent {
  type: "click";
  data: {
    element: string;
    elementId?: string;
    elementClass?: string;
    coordinates: {
      x: number;
      y: number;
    };
    path: string;
  };
}

export interface ScrollEvent extends TrackingEvent {
  type: "scroll";
  data: {
    scrollY: number;
    scrollX: number;
    path: string;
    direction: "up" | "down" | "left" | "right";
    percentage: number; // Page scroll percentage
  };
}

export interface PageViewEvent extends TrackingEvent {
  type: "pageview";
  data: {
    path: string;
    previousPath?: string;
    referrer?: string;
    userAgent: string;
    timestamp: number;
  };
}

export interface UserTrackingContextType {
  trackEvent: (event: TrackingEvent) => void;
  trackClick: (element: HTMLElement, event: MouseEvent) => void;
  trackScroll: (scrollData: Omit<ScrollEvent["data"], "path">) => void;
  trackPageView: (path: string, previousPath?: string) => void;
  events: TrackingEvent[];
  isTracking: boolean;
  setIsTracking: (enabled: boolean) => void;
}
