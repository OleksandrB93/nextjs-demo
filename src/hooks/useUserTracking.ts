import { useUserTracking as useUserTrackingContext } from "@/components/Providers/UserTrackingProvider";

/**
 * Hook for tracking user behavior
 *
 * @example
 * ```tsx
 * import { useUserTracking } from '@/hooks/useUserTracking';
 *
 * function MyComponent() {
 *   const { trackCustomEvent, events, isTracking } = useUserTracking();
 *
 *   const handleSpecialAction = () => {
 *     trackCustomEvent('special_action', {
 *       buttonId: 'special-btn',
 *       timestamp: Date.now()
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSpecialAction}>Special Action</button>
 *       <p>Events tracked: {events.length}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserTracking() {
  const context = useUserTrackingContext();

  /**
   * Track custom event with arbitrary data
   */
  const trackCustomEvent = (eventType: string, data: Record<string, any>) => {
    context.trackEvent({
      type: "click", // Use base type but add custom data
      timestamp: Date.now(),
      data: {
        customEventType: eventType,
        ...data,
        path: window.location.pathname,
      },
    });
  };

  /**
   * Track form interaction
   */
  const trackFormInteraction = (
    formId: string,
    action: "focus" | "blur" | "submit" | "change",
    fieldName?: string
  ) => {
    trackCustomEvent("form_interaction", {
      formId,
      action,
      fieldName,
      timestamp: Date.now(),
    });
  };

  /**
   * Track page duration
   */
  const trackPageDuration = (startTime: number) => {
    const duration = Date.now() - startTime;
    trackCustomEvent("page_duration", {
      duration,
      durationFormatted: `${Math.round(duration / 1000)}s`,
      path: window.location.pathname,
    });
  };

  /**
   * Get event statistics
   */
  const getEventStats = () => {
    const { events } = context;
    const clickEvents = events.filter((e) => e.type === "click");
    const scrollEvents = events.filter((e) => e.type === "scroll");
    const pageViewEvents = events.filter((e) => e.type === "pageview");

    return {
      total: events.length,
      clicks: clickEvents.length,
      scrolls: scrollEvents.length,
      pageViews: pageViewEvents.length,
      lastEvent: events[events.length - 1],
    };
  };

  return {
    ...context,
    trackCustomEvent,
    trackFormInteraction,
    trackPageDuration,
    getEventStats,
  };
}

export default useUserTracking;
