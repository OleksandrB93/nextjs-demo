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
import { useState, useEffect } from "react";
import {
  useTrackingEvents,
  useTrackingStats,
} from "@/hooks/useTrackingGraphQL";
import { useChartData } from "@/hooks/useChartData";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { trackingChartConfig } from "@/configs/chart-configs";
import { LocationDisplay } from "@/components/LocationDisplay";

import CityChart from "@/components/Dashboard/CityChart";
import WorldMapChart from "@/components/Dashboard/WorldMapChart";
import EventsChart from "@/components/Dashboard/EventsShart";
import CircleChart from "@/components/Dashboard/CircleChart";

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
  const [cityFilter, setCityFilter] = useState("");

  // Get current location
  const {
    location,
    loading: locationLoading,
    error: locationError,
    getCurrentLocation,
  } = useCurrentLocation();

  // Use the chart data hook
  const {
    chartData,
    cityData,
    filteredCityData,
    browserChartData: chartData2,
    browserChartConfig,
    osChartData,
    osChartConfig,
    countryStatsMap,
    getCountryColor,
    getHoverColor,
    getCountryName,
  } = useChartData(events, browserStats, osStats, countryStats, cityFilter);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6 space-y-8 backdrop-blur-sm bg-background/50 rounded-lg border border-foreground/10">
      <LocationDisplay
        location={location}
        loading={locationLoading}
        error={locationError}
        onRefresh={getCurrentLocation}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WorldMapChart
          tooltip={tooltip}
          setTooltip={setTooltip}
          countryStatsMap={countryStatsMap}
          getCountryColor={getCountryColor}
          getHoverColor={getHoverColor}
          getCountryName={getCountryName}
          currentLocation={location}
        />

        <CityChart
          cityData={cityData}
          filteredCityData={filteredCityData}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventsChart chartData={chartData} />

        <CircleChart
          title="Browser Usage - Visitors"
          description="Real-time data from tracking"
          liveData={true}
          total={browserStats.reduce(
            (acc: number, curr: any) => acc + curr.count,
            0
          )}
          chartData={chartData2}
          stats={browserStats}
          chartConfig={browserChartConfig}
          dataKey="visitors"
          labelKey="browser"
          valueLabel="visitors"
        />

        <CircleChart
          title="OS Usage - Users"
          description="Real-time data from tracking"
          liveData={true}
          total={osStats.reduce(
            (acc: number, curr: any) => acc + curr.count,
            0
          )}
          chartData={osChartData}
          stats={osStats}
          chartConfig={osChartConfig}
          dataKey="users"
          labelKey="os"
          valueLabel="users"
        />
      </div>
    </div>
  );
}
