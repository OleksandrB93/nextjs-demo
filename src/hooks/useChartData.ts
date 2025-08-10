import { useMemo } from "react";
import { countryNames } from "../configs/countryISO";
import { ChartConfig } from "../components/ui/chart";
import {
  browserChartConfig as staticBrowserConfig,
  osChartConfig as staticOSConfig,
} from "../configs/chart-configs";

interface Event {
  timestamp: string;
  type: string;
  city?: string;
}

interface BrowserStat {
  browser: string;
  count: number;
}

interface OSStat {
  os: string;
  count: number;
}

interface CountryStat {
  country: string;
  count: number;
}

interface ChartDataItem {
  date: string;
  clicks: number;
  scrolls: number;
  pageviews: number;
}

interface CityDataItem {
  city: string;
  clicks: number;
  scrolls: number;
  pageviews: number;
  total: number;
}

interface BrowserChartItem {
  browser: string;
  visitors: number;
  fill: string;
}

interface OSChartItem {
  os: string;
  users: number;
  fill: string;
}

export const useChartData = (
  events: Event[],
  browserStats: BrowserStat[],
  osStats: OSStat[],
  countryStats: CountryStat[],
  cityFilter: string = ""
) => {
  // Process data for chart
  const chartData = useMemo(() => {
    if (!events.length) return [];

    // Group events by day
    const eventsByDate = events.reduce((acc, event) => {
      const date = new Date(event.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, clicks: 0, scrolls: 0, pageviews: 0 };
      }

      if (event.type === "CLICK") acc[date].clicks++;
      if (event.type === "SCROLL") acc[date].scrolls++;
      if (event.type === "PAGEVIEW") acc[date].pageviews++;

      return acc;
    }, {} as Record<string, ChartDataItem>);

    return Object.values(eventsByDate).slice(-7); // last 7 days
  }, [events]);

  // Process city data from events
  const cityData = useMemo(() => {
    if (!events.length) return [];

    // Group events by city
    const cityStats = events.reduce(
      (acc: Record<string, CityDataItem>, event: Event) => {
        const city = event.city || "Unknown";
        if (!acc[city]) {
          acc[city] = { city, clicks: 0, scrolls: 0, pageviews: 0, total: 0 };
        }

        if (event.type === "CLICK") acc[city].clicks++;
        if (event.type === "SCROLL") acc[city].scrolls++;
        if (event.type === "PAGEVIEW") acc[city].pageviews++;
        acc[city].total++;

        return acc;
      },
      {} as Record<string, CityDataItem>
    );

    // Convert to array and sort by total events
    return Object.values(cityStats)
      .sort((a: CityDataItem, b: CityDataItem) => b.total - a.total)
      .slice(0, 10); // Top 10 cities
  }, [events]);

  // Filtered city data based on search
  const filteredCityData = useMemo(() => {
    if (!cityFilter.trim()) return cityData;

    return cityData.filter((city: CityDataItem) =>
      city.city.toLowerCase().includes(cityFilter.toLowerCase())
    );
  }, [cityData, cityFilter]);

  // Real browser data from tracking
  const browserChartData = useMemo(() => {
    if (!browserStats.length) {
      // Fallback data if no real data available
      return [
        { browser: "chrome", visitors: 275, fill: "var(--chart-1)" },
        { browser: "safari", visitors: 200, fill: "var(--chart-2)" },
        { browser: "firefox", visitors: 187, fill: "var(--chart-3)" },
        { browser: "edge", visitors: 173, fill: "var(--chart-4)" },
        { browser: "other", visitors: 90, fill: "var(--chart-5)" },
      ];
    }

    // show real data + other browsers with 0 values for context
    const allBrowsers = ["chrome", "safari", "firefox", "edge", "other"];
    const realDataMap = new Map();

    browserStats.forEach((stat: BrowserStat) => {
      realDataMap.set(stat.browser.toLowerCase(), stat.count);
    });

    return allBrowsers.map((browser, index) => {
      const realValue = realDataMap.get(browser) || 0;
      return {
        browser,
        visitors: realValue > 0 ? realValue : 1, // minimum value 1 for visibility
        fill: `var(--chart-${index + 1})`,
      };
    });
  }, [browserStats]);

  const browserChartConfig = useMemo(() => {
    return staticBrowserConfig;
  }, []) satisfies ChartConfig;

  // OS data for additional chart
  const osChartData = useMemo(() => {
    if (!osStats.length) {
      return [
        { os: "windows", users: 450, fill: "var(--chart-1)" },
        { os: "macos", users: 250, fill: "var(--chart-2)" },
        { os: "linux", users: 120, fill: "var(--chart-3)" },
        { os: "android", users: 180, fill: "var(--chart-4)" },
        { os: "ios", users: 90, fill: "var(--chart-5)" },
      ];
    }

    // show real data + other OS with 0 values for context
    const allOS = ["windows", "macos", "linux", "android", "ios"];
    const realDataMap = new Map();

    osStats.forEach((stat: OSStat) => {
      realDataMap.set(stat.os.toLowerCase(), stat.count);
    });

    return allOS.map((os, index) => {
      const realValue = realDataMap.get(os) || 0;
      return {
        os,
        users: realValue > 0 ? realValue : 1, // minimum value 1 for visibility
        fill: `var(--chart-${index + 1})`,
      };
    });
  }, [osStats]);

  const osChartConfig = useMemo(() => {
    return staticOSConfig;
  }, []) satisfies ChartConfig;

  // convert countryStats array to object for convenience
  const countryStatsMap = useMemo(() => {
    const map: Record<string, number> = {};
    countryStats.forEach((stat: CountryStat) => {
      // find ISO code by country name
      let isoCode = Object.keys(countryNames).find(
        (code) =>
          countryNames[code].toLowerCase() === stat.country.toLowerCase()
      );

      // if not found, try partial match
      if (!isoCode) {
        isoCode = Object.keys(countryNames).find(
          (code) =>
            countryNames[code]
              .toLowerCase()
              .includes(stat.country.toLowerCase()) ||
            stat.country
              .toLowerCase()
              .includes(countryNames[code].toLowerCase())
        );
      }

      // special cases
      if (!isoCode) {
        if (stat.country === "United States") isoCode = "USA";
        if (stat.country === "Ukraine") isoCode = "UKR";
        if (stat.country === "Germany") isoCode = "DEU";
        if (stat.country === "France") isoCode = "FRA";
        if (stat.country === "Canada") isoCode = "CAN";
      }

      if (isoCode) {
        map[isoCode] = stat.count;
        // add full country names for compatibility with map
        map[countryNames[isoCode]] = stat.count;

        // add alternative names
        if (stat.country === "United States") {
          map["United States of America"] = stat.count;
        }
        if (stat.country === "Ukraine") {
          map["Ukraine"] = stat.count;
        }
      }
    });

    return map;
  }, [countryStats]);

  // function to get color based on value
  const getCountryColor = (value: number) => {
    if (value === 0) return "#f0f0f0"; // light gray for countries without data

    // blue scale from light blue to dark blue
    const values = Object.values(countryStatsMap);
    const maxValue = values.length > 0 ? Math.max(...values) : 1;
    const intensity = Math.min(value / maxValue, 1);

    // use blue scale with transparency
    const alpha = 0.3 + intensity * 0.7; // from 0.3 to 1.0
    return `rgba(0, 123, 255, ${alpha})`;
  };

  // function to get hover color
  const getHoverColor = (value: number) => {
    if (value === 0) return "#FF9800"; // orange for countries without data
    return "#FF5722"; // red for countries with data
  };

  // function to get country name by ISO code
  const getCountryName = (isoCode: string) => {
    return countryNames[isoCode] || isoCode;
  };

  return {
    chartData,
    cityData,
    filteredCityData,
    browserChartData,
    browserChartConfig,
    osChartData,
    osChartConfig,
    countryStatsMap,
    getCountryColor,
    getHoverColor,
    getCountryName,
  };
};
