import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { TrendingUp, MapPin } from "lucide-react";
import { GEO_URL } from "@/configs/constants";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  region?: string;
  timezone?: string;
}

interface WorldMapChartProps {
  tooltip: string;
  setTooltip: (tooltip: string) => void;
  countryStatsMap: Record<string, number>;
  getCountryColor: (value: number) => string;
  getHoverColor: (value: number) => string;
  getCountryName: (isoCode: string) => string;
  currentLocation?: LocationData | null;
}

const WorldMapChart = ({
  tooltip,
  setTooltip,
  countryStatsMap,
  getCountryColor,
  getHoverColor,
  getCountryName,
  currentLocation,
}: WorldMapChartProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between">
          <CardTitle>🌍 Global User Activity Map</CardTitle>
          <CardDescription>
            Interactive world map showing user activity by country
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div style={{ position: "relative" }}>
          <ComposableMap
            projectionConfig={{ scale: 140 }}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={GEO_URL}>
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
                        setTooltip(`CLICKED: ${countryName} — ${value} clicks`);
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
        <div className="mt-4 flex items-center justify-center gap-4 text-sm flex-wrap">
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
          {/* {currentLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <span>Your location</span>
            </div>
          )} */}
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
  );
};

export default WorldMapChart;
