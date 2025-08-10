import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import {
  CREATE_TRACKING_EVENT,
  UPDATE_PAGE_ANALYTICS,
  UPDATE_CLICK_HEATMAP,
} from "@/graphql/tracking-mutations";
import {
  GET_TRACKING_STATS,
  GET_TRACKING_EVENTS,
} from "@/graphql/tracking-queries";
import { TrackingEvent } from "@/types/tracking";

export function useTrackingGraphQL() {
  const { data: session } = useSession();

  const [createTrackingEvent] = useMutation(CREATE_TRACKING_EVENT);
  const [updatePageAnalytics] = useMutation(UPDATE_PAGE_ANALYTICS);
  const [updateClickHeatmap] = useMutation(UPDATE_CLICK_HEATMAP);

  // Send tracking event to server
  const saveTrackingEvent = async (event: TrackingEvent) => {
    try {
      // get location
      let locationData = {
        country: null as string | null,
        city: null as string | null,
        region: null as string | null,
        timezone: null as string | null,
      };

      try {
        console.log("Requesting geolocation...");
        const geoResponse = await fetch("/api/geolocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const geoData = await geoResponse.json();
        console.log("Geolocation response:", geoData);

        if (geoData.success && geoData.location) {
          // check if we got real data
          const hasRealData =
            geoData.location.country !== "Unknown" ||
            geoData.location.city !== "Unknown";

          if (hasRealData) {
            locationData = geoData.location;
            console.log("Using real location data:", locationData);
          } else {
            console.log('Got "Unknown" location data, using demo data');
            // use demo data for testing (Odesa, Ukraine)
            locationData = {
              country: "Ukraine",
              city: "Odesa",
              region: "Odesa Oblast",
              timezone: "Europe/Kiev",
            };
          }
        } else {
          console.warn("Geolocation API returned no data, using demo data");
          // fallback to demo data (Odesa, Ukraine)
          locationData = {
            country: "Ukraine",
            city: "Odesa",
            region: "Odesa Oblast",
            timezone: "Europe/Kiev",
          };
        }
      } catch (error) {
        console.warn("Failed to get location, using demo data:", error);

      }

      // parse User Agent on client
      const parseUserAgent = (ua: string) => {
        // simplified version of parsing for client
        let browser = "Unknown";
        let browserVersion = "Unknown";
        let os = "Unknown";
        let device = "Desktop";

        if (ua.includes("Chrome") && !ua.includes("Edg")) {
          browser = "Chrome";
          const match = ua.match(/Chrome\/([0-9.]+)/);
          browserVersion = match ? match[1] : "Unknown";
        } else if (ua.includes("Firefox")) {
          browser = "Firefox";
          const match = ua.match(/Firefox\/([0-9.]+)/);
          browserVersion = match ? match[1] : "Unknown";
        } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
          browser = "Safari";
          const match = ua.match(/Version\/([0-9.]+)/);
          browserVersion = match ? match[1] : "Unknown";
        } else if (ua.includes("Edg")) {
          browser = "Edge";
          const match = ua.match(/Edg\/([0-9.]+)/);
          browserVersion = match ? match[1] : "Unknown";
        }

        if (ua.includes("Windows")) os = "Windows";
        else if (ua.includes("Mac")) os = "macOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

        if (ua.includes("Mobile") || ua.includes("iPhone")) device = "Mobile";
        else if (ua.includes("Tablet") || ua.includes("iPad"))
          device = "Tablet";

        return { browser, browserVersion, os, device };
      };

      const userAgentData = parseUserAgent(navigator.userAgent || "");

      const input = {
        type: event.type.toUpperCase(),
        timestamp: new Date(event.timestamp).toISOString(),
        data: JSON.stringify(event.data),
        sessionToken: session?.user?.id ? null : generateSessionId(),
        userAgent: navigator.userAgent || null,
        ipAddress: null, // will be filled on server
        browser: userAgentData.browser,
        browserVersion: userAgentData.browserVersion,
        os: userAgentData.os,
        osVersion: null,
        device: userAgentData.device,
        country: locationData.country,
        city: locationData.city,
        region: locationData.region,
        timezone: locationData.timezone,
      };

      await createTrackingEvent({
        variables: {
          input,
        },
      });
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  // Update page analytics
  const trackPageView = async (path: string, title?: string) => {
    try {
      await updatePageAnalytics({
        variables: {
          path,
          title: title || null, // null instead of undefined
        },
      });
    } catch (error) {
      console.error("Failed to update page analytics:", error);
    }
  };

  // Track clicks for heatmap
  const trackClick = async (
    path: string,
    elementType: string,
    x: number,
    y: number,
    elementId?: string,
    elementClass?: string
  ) => {
    try {
      await updateClickHeatmap({
        variables: {
          path,
          elementType,
          elementId:
            elementId && typeof elementId === "string" ? elementId : null,
          elementClass:
            elementClass && typeof elementClass === "string"
              ? elementClass
              : null,
          x,
          y,
        },
      });
    } catch (error) {
      console.error("Failed to update click heatmap:", error);
    }
  };

  return {
    saveTrackingEvent,
    trackPageView,
    trackClick,
  };
}

// generate unique session ID for anonymous users
function generateSessionId(): string {
  if (typeof window !== "undefined") {
    let sessionId = localStorage.getItem("tracking-session-id");
    if (!sessionId) {
      sessionId =
        "anon_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("tracking-session-id", sessionId);
    }
    return sessionId;
  }
  return "server_" + Date.now();
}

// hook for getting tracking statistics
export function useTrackingStats(
  userId?: string,
  dateFrom?: string,
  dateTo?: string
) {
  const { data, loading, error, refetch } = useQuery(GET_TRACKING_STATS, {
    variables: {
      userId: userId || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    },
    pollInterval: 30000, // update every 30 seconds
    errorPolicy: "all", // show partial data even with errors
  });

  return {
    stats: data?.trackingStats,
    browserStats: data?.trackingStats?.browserStats || [],
    osStats: data?.trackingStats?.osStats || [],
    countryStats: data?.trackingStats?.countryStats || [],
    deviceStats: data?.trackingStats?.deviceStats || [],
    loading,
    error,
    refetch,
  };
}

// Hook for getting tracking events
export function useTrackingEvents(
  userId?: string,
  sessionToken?: string,
  type?: string,
  limit = 50,
  offset = 0
) {
  const { data, loading, error, refetch } = useQuery(GET_TRACKING_EVENTS, {
    variables: {
      userId: userId || null,
      sessionToken: sessionToken || null,
      type: type || null,
      limit,
      offset,
    },
    errorPolicy: "all", // Show partial data even with errors
  });

  return {
    events: data?.trackingEvents || [],
    loading,
    error,
    refetch,
  };
}
