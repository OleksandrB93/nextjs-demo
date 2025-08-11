import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../../ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { trackingChartConfig } from "@/configs/chart-configs";

interface EventsChartProps {
  chartData: any;
}

const EventsChart = ({ chartData }) => {
  return (
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
          <Bar dataKey="pageviews" fill="var(--color-pageviews)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default EventsChart;
