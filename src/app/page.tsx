"use client";
/* eslint-disable */
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  RadialBar,
  RadialBarChart,
  XAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, MapPin, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import {
  useTrackingEvents,
  useTrackingStats,
} from "@/hooks/useTrackingGraphQL";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

const trackingChartConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--chart-1)",
  },
  scrolls: {
    label: "Scrolls",
    color: "var(--chart-2)",
  },
  pageviews: {
    label: "Page Views",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// full dictionary of country names with ISO codes
const countryNames: Record<string, string> = {
  AFG: "Afghanistan",
  ALB: "Albania",
  DZA: "Algeria",
  AND: "Andorra",
  AGO: "Angola",
  ATG: "Antigua and Barbuda",
  ARG: "Argentina",
  ARM: "Armenia",
  AUS: "Australia",
  AUT: "Austria",
  AZE: "Azerbaijan",
  BHS: "Bahamas",
  BHR: "Bahrain",
  BGD: "Bangladesh",
  BRB: "Barbados",
  BLR: "Belarus",
  BEL: "Belgium",
  BLZ: "Belize",
  BEN: "Benin",
  BTN: "Bhutan",
  BOL: "Bolivia",
  BIH: "Bosnia and Herzegovina",
  BWA: "Botswana",
  BRA: "Brazil",
  BRN: "Brunei",
  BGR: "Bulgaria",
  BFA: "Burkina Faso",
  BDI: "Burundi",
  CPV: "Cabo Verde",
  KHM: "Cambodia",
  CMR: "Cameroon",
  CAN: "Canada",
  CAF: "Central African Republic",
  TCD: "Chad",
  CHL: "Chile",
  CHN: "China",
  COL: "Colombia",
  COM: "Comoros",
  COG: "Congo",
  CRI: "Costa Rica",
  HRV: "Croatia",
  CUB: "Cuba",
  CYP: "Cyprus",
  CZE: "Czech Republic",
  CIV: "Côte d'Ivoire",
  PRK: "North Korea",
  COD: "Democratic Republic of the Congo",
  DNK: "Denmark",
  DJI: "Djibouti",
  DOM: "Dominican Republic",
  ECU: "Ecuador",
  EGY: "Egypt",
  SLV: "El Salvador",
  GNQ: "Equatorial Guinea",
  ERI: "Eritrea",
  EST: "Estonia",
  SWZ: "Eswatini",
  ETH: "Ethiopia",
  FJI: "Fiji",
  FIN: "Finland",
  FRA: "France",
  GAB: "Gabon",
  GMB: "Gambia",
  GEO: "Georgia",
  DEU: "Germany",
  GHA: "Ghana",
  GRC: "Greece",
  GRD: "Grenada",
  GTM: "Guatemala",
  GIN: "Guinea",
  GNB: "Guinea-Bissau",
  GUY: "Guyana",
  HTI: "Haiti",
  HND: "Honduras",
  HUN: "Hungary",
  ISL: "Iceland",
  IND: "India",
  IDN: "Indonesia",
  IRN: "Iran",
  IRQ: "Iraq",
  IRL: "Ireland",
  ISR: "Israel",
  ITA: "Italy",
  JAM: "Jamaica",
  JPN: "Japan",
  JOR: "Jordan",
  KAZ: "Kazakhstan",
  KEN: "Kenya",
  KIR: "Kiribati",
  KWT: "Kuwait",
  KGZ: "Kyrgyzstan",
  LAO: "Laos",
  LVA: "Latvia",
  LBN: "Lebanon",
  LSO: "Lesotho",
  LBR: "Liberia",
  LBY: "Libya",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  MDG: "Madagascar",
  MWI: "Malawi",
  MYS: "Malaysia",
  MDV: "Maldives",
  MLI: "Mali",
  MLT: "Malta",
  MHL: "Marshall Islands",
  MRT: "Mauritania",
  MUS: "Mauritius",
  MEX: "Mexico",
  FSM: "Micronesia",
  MDA: "Moldova",
  MCO: "Monaco",
  MNG: "Mongolia",
  MNE: "Montenegro",
  MAR: "Morocco",
  MOZ: "Mozambique",
  MMR: "Myanmar",
  NAM: "Namibia",
  NRU: "Nauru",
  NPL: "Nepal",
  NLD: "Netherlands",
  NZL: "New Zealand",
  NIC: "Nicaragua",
  NER: "Niger",
  NGA: "Nigeria",
  MKD: "North Macedonia",
  NOR: "Norway",
  OMN: "Oman",
  PAK: "Pakistan",
  PLW: "Palau",
  PAN: "Panama",
  PNG: "Papua New Guinea",
  PRY: "Paraguay",
  PER: "Peru",
  PHL: "Philippines",
  POL: "Poland",
  PRT: "Portugal",
  QAT: "Qatar",
  KOR: "South Korea",
  ROU: "Romania",
  RUS: "Russia",
  RWA: "Rwanda",
  KNA: "Saint Kitts and Nevis",
  LCA: "Saint Lucia",
  VCT: "Saint Vincent and the Grenadines",
  WSM: "Samoa",
  SMR: "San Marino",
  STP: "Sao Tome and Principe",
  SAU: "Saudi Arabia",
  SEN: "Senegal",
  SRB: "Serbia",
  SYC: "Seychelles",
  SLE: "Sierra Leone",
  SGP: "Singapore",
  SVK: "Slovakia",
  SVN: "Slovenia",
  SLB: "Solomon Islands",
  SOM: "Somalia",
  ZAF: "South Africa",
  SSD: "South Sudan",
  ESP: "Spain",
  LKA: "Sri Lanka",
  SDN: "Sudan",
  SUR: "Suriname",
  SWE: "Sweden",
  CHE: "Switzerland",
  SYR: "Syria",
  TWN: "Taiwan",
  TJK: "Tajikistan",
  TZA: "Tanzania",
  THA: "Thailand",
  TLS: "Timor-Leste",
  TGO: "Togo",
  TON: "Tonga",
  TTO: "Trinidad and Tobago",
  TUN: "Tunisia",
  TUR: "Turkey",
  TKM: "Turkmenistan",
  TUV: "Tuvalu",
  UGA: "Uganda",
  UKR: "Ukraine",
  ARE: "United Arab Emirates",
  GBR: "United Kingdom",
  USA: "United States",
  URY: "Uruguay",
  UZB: "Uzbekistan",
  VUT: "Vanuatu",
  VAT: "Vatican City",
  VEN: "Venezuela",
  VNM: "Vietnam",
  YEM: "Yemen",
  ZMB: "Zambia",
  ZWE: "Zimbabwe",
};

export default function Home() {
  const { events, loading, error, refetch } = useTrackingEvents(
    undefined, // userId - all users
    undefined, // sessionToken - all sessions
    undefined, // type - all event types
    1000, // limit - maximum events (increase if needed)
    0 // offset - start from the beginning
  );

  const {
    browserStats,
    osStats,
    countryStats,
    deviceStats,
    loading: statsLoading,
    error: statsError,
  } = useTrackingStats();
  const [tooltip, setTooltip] = useState("");
  const [customLocation, setCustomLocation] = useState<any>(null);
  const [cityFilter, setCityFilter] = useState("");

  // load current custom location
  const loadCurrentLocation = async () => {
    setCustomLocation(null);
  };

  // load current location when page loads
  useEffect(() => {
    loadCurrentLocation();
  }, []);

  // Process data for chart
  const chartData = useMemo(() => {
    if (!events.length) return [];

    // Group events by day
    // @ts-ignore
    const eventsByDate = events.reduce((acc, event) => {
      const date = new Date(event.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, clicks: 0, scrolls: 0, pageviews: 0 };
      }

      if (event.type === "CLICK") acc[date].clicks++;
      if (event.type === "SCROLL") acc[date].scrolls++;
      if (event.type === "PAGEVIEW") acc[date].pageviews++;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(eventsByDate).slice(-7); // last 7 days
  }, [events]);

  // Process city data from events
  const cityData = useMemo(() => {
    if (!events.length) return [];

    // Group events by city
    const cityStats = events.reduce((acc: Record<string, any>, event: any) => {
      const city = event.city || "Unknown";
      if (!acc[city]) {
        acc[city] = { city, clicks: 0, scrolls: 0, pageviews: 0, total: 0 };
      }

      if (event.type === "CLICK") acc[city].clicks++;
      if (event.type === "SCROLL") acc[city].scrolls++;
      if (event.type === "PAGEVIEW") acc[city].pageviews++;
      acc[city].total++;

      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by total events
    return Object.values(cityStats)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 10); // Top 10 cities
  }, [events]);

  // Filtered city data based on search
  const filteredCityData = useMemo(() => {
    if (!cityFilter.trim()) return cityData;

    return cityData.filter((city: any) =>
      city.city.toLowerCase().includes(cityFilter.toLowerCase())
    );
  }, [cityData, cityFilter]);

  // Real browser data from tracking
  const chartData2 = useMemo(() => {
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

    browserStats.forEach((stat: any) => {
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
    const config: Record<string, { label: string; color?: string }> = {
      visitors: {
        label: "Visitors",
      },
      chrome: { label: "Chrome", color: "var(--chart-1)" },
      safari: { label: "Safari", color: "var(--chart-2)" },
      firefox: { label: "Firefox", color: "var(--chart-3)" },
      edge: { label: "Edge", color: "var(--chart-4)" },
      other: { label: "Other", color: "var(--chart-5)" },
    };

    return config;
  }, [browserStats]) satisfies ChartConfig;

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

    osStats.forEach((stat: any) => {
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
    const config: Record<string, { label: string; color?: string }> = {
      users: {
        label: "Users",
      },
      windows: { label: "Windows", color: "var(--chart-1)" },
      macos: { label: "macOS", color: "var(--chart-2)" },
      linux: { label: "Linux", color: "var(--chart-3)" },
      android: { label: "Android", color: "var(--chart-4)" },
      ios: { label: "iOS", color: "var(--chart-5)" },
    };

    return config;
  }, [osStats]) satisfies ChartConfig;

  // convert countryStats array to object for convenience
  const countryStatsMap = useMemo(() => {
    const map: Record<string, number> = {};
    countryStats.forEach((stat: any) => {
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

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6 space-y-8 backdrop-blur-sm bg-background/50 rounded-lg border border-foreground/10">
      {/* Location Control Panel */}
      <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-lg border">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">
            {customLocation
              ? `Custom Location: ${customLocation.city}, ${customLocation.country}`
              : "Using detected location"}
          </span>
        </div>
      </div>

      <div className="flex justify-evenly gap-6 flex-wrap">
        <div className="rounded-lg bg-foreground/5 p-4 border">
          <h3 className="text-lg font-semibold mb-4">📊 Analytics Chart</h3>
          <ChartContainer
            config={trackingChartConfig}
            className="h-[400px] w-full max-w-[400px]"
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="clicks" fill="var(--color-clicks)" radius={4} />
              <Bar dataKey="scrolls" fill="var(--color-scrolls)" radius={4} />
              <Bar
                dataKey="pageviews"
                fill="var(--color-pageviews)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <Card className="flex flex-col max-w-[400px]">
          <CardHeader className="items-center pb-0">
            <CardTitle>Browser Usage - Visitors</CardTitle>
            <CardDescription>
              {browserStats.length > 0
                ? "Real-time data from tracking"
                : "Demo data (no tracking events yet)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={browserChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={chartData2}
                startAngle={-90}
                endAngle={380}
                innerRadius={30}
                outerRadius={110}
              >
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      // show tooltip only for segments with real data (> 1)
                      if (data.visitors > 1) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor: data.fill
                                    .replace("var(", "")
                                    .replace(")", ""),
                                }}
                              />
                              <span className="font-medium capitalize">
                                {data.browser}
                              </span>
                              <span className="text-muted-foreground">
                                {data.visitors} visitors
                              </span>
                            </div>
                          </div>
                        );
                      }
                    }
                    return null;
                  }}
                />
                <RadialBar dataKey="visitors" background>
                  <LabelList
                    position="insideStart"
                    dataKey="browser"
                    className="fill-white capitalize mix-blend-luminosity"
                    fontSize={11}
                  />
                </RadialBar>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              {browserStats.length > 0 ? "Live data" : "Sample data"}{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              {browserStats.length > 0
                ? `Total: ${browserStats.reduce(
                    (sum: number, stat: any) => sum + stat.count,
                    0
                  )} users`
                : "Showing sample browser usage data"}
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col max-w-[400px]">
          <CardHeader className="items-center pb-0">
            <CardTitle>Operating Systems</CardTitle>
            <CardDescription>
              {osStats.length > 0
                ? "User platform distribution"
                : "Demo data (no tracking events yet)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={osChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={osChartData}
                startAngle={-90}
                endAngle={380}
                innerRadius={30}
                outerRadius={110}
              >
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      // show tooltip only for segments with real data (> 1)
                      if (data.users > 1) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  backgroundColor: data.fill
                                    .replace("var(", "")
                                    .replace(")", ""),
                                }}
                              />
                              <span className="font-medium capitalize">
                                {data.os}
                              </span>
                              <span className="text-muted-foreground">
                                {data.users} users
                              </span>
                            </div>
                          </div>
                        );
                      }
                    }
                    return null;
                  }}
                />
                <RadialBar dataKey="users" background>
                  <LabelList
                    position="insideStart"
                    dataKey="os"
                    className="fill-white capitalize mix-blend-luminosity"
                    fontSize={11}
                  />
                </RadialBar>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              {osStats.length > 0 ? "Live data" : "Sample data"}{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              {osStats.length > 0
                ? `Total: ${osStats.reduce(
                    (sum: number, stat: any) => sum + stat.count,
                    0
                  )} users`
                : "Showing sample OS usage data"}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* World Map Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>🌍 Global User Activity Map</CardTitle>
          <CardDescription>
            Interactive world map showing user activity by country
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div style={{ position: "relative" }}>
            <ComposableMap
              projectionConfig={{ scale: 140 }}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => {
                  // if no geographies, show loading message
                  if (!geographies || geographies.length === 0) {
                    return (
                      <text x="50%" y="50%" textAnchor="middle" fill="#666">
                        Loading map data...
                      </text>
                    );
                  }

                  return geographies.map((geo) => {
                    let isoCode = geo.properties.ISO_A3;

                    // if ISO_A3 is not available, try other fields
                    if (!isoCode) {
                      isoCode =
                        geo.properties.ISO_A2 ||
                        geo.properties.ISO_N3 ||
                        geo.properties.ADM0_A3;
                    }

                    // skip countries without ISO code
                    if (!isoCode) {
                      // instead of skipping, use country name as ISO code
                      isoCode =
                        geo.properties.ADMIN ||
                        geo.properties.NAME ||
                        geo.properties.name ||
                        geo.properties.country ||
                        "UNKNOWN";
                    }

                    const value = countryStatsMap[isoCode] || 0;
                    const countryName = getCountryName(isoCode);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          setTooltip(`${countryName} — ${value} clicks`);
                        }}
                        onClick={() => {
                          setTooltip(
                            `CLICKED: ${countryName} — ${value} clicks`
                          );
                        }}
                        onMouseLeave={() => {
                          setTooltip("");
                        }}
                        style={{
                          default: {
                            fill: getCountryColor(value),
                            stroke: "#ffffff",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: getHoverColor(value),
                            stroke: "#ffffff",
                            strokeWidth: 1,
                            outline: "none",
                          },
                          pressed: {
                            fill: getHoverColor(value),
                            stroke: "#ffffff",
                            strokeWidth: 1,
                            outline: "none",
                          },
                        }}
                      />
                    );
                  });
                }}
              </Geographies>
            </ComposableMap>

            {/* Simple Tooltip */}
            {tooltip && (
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  background: "rgba(0, 0, 0, 0.9)",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  zIndex: 1000,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {tooltip}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>No data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span>Low activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span>Medium activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>High activity</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>
              {Object.keys(countryStatsMap).length > 0
                ? `Showing data from ${
                    Object.keys(countryStatsMap).length
                  } countries`
                : "No country data available yet"}
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Cities Bar Chart */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>🏙️ Top Cities by Activity</CardTitle>
              <CardDescription>
                Most active cities based on user interactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search cities..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {cityFilter && (
                <button
                  onClick={() => setCityFilter("")}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCityData.length > 0 ? (
            <div className="space-y-3">
              {filteredCityData.map((city: any, index: number) => (
                <div key={city.city} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{city.city}</span>
                      <span className="text-sm text-muted-foreground">
                        {city.total} events
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (city.total / (filteredCityData[0] as any).total) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{city.clicks} clicks</span>
                      <span>{city.scrolls} scrolls</span>
                      <span>{city.pageviews} pageviews</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cityData.length > 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No cities found matching "{cityFilter}"</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No city data available yet</p>
              <p className="text-sm">
                City data will appear as users interact with the site
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>
              {cityFilter
                ? `Found ${filteredCityData.length} cities matching "${cityFilter}"`
                : cityData.length > 0
                ? `Showing top ${cityData.length} cities`
                : "No city data available yet"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
