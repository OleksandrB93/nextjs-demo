import { ChartConfig } from "../components/ui/chart";

export const trackingChartConfig = {
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

export const browserChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
  edge: { label: "Edge", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig;

export const osChartConfig = {
  users: {
    label: "Users",
  },
  windows: { label: "Windows", color: "var(--chart-1)" },
  macos: { label: "macOS", color: "var(--chart-2)" },
  linux: { label: "Linux", color: "var(--chart-3)" },
  android: { label: "Android", color: "var(--chart-4)" },
  ios: { label: "iOS", color: "var(--chart-5)" },
} satisfies ChartConfig;
