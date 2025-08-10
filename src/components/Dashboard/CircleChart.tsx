import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";
import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

interface CircleChartProps {
  title: string;
  chartData: any;
  stats: any[];
  chartConfig: any;
  liveData: boolean;
  total: number;
  description: string;
  dataKey: string;
  labelKey: string;
  valueLabel: string;
}

const CircleChart = ({
  title,
  chartData,
  stats,
  chartConfig,
  liveData,
  total,
  description,
  dataKey,
  labelKey,
  valueLabel,
}: CircleChartProps) => {
  return (
    <Card className="flex flex-col min-w-[300px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
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
                  if (data[dataKey] > 1) {
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
                            {data[labelKey]}
                          </span>
                          <span className="text-muted-foreground">
                            {data[dataKey]} {valueLabel}
                          </span>
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              }}
            />
            <RadialBar dataKey={dataKey} background>
              <LabelList
                position="insideStart"
                dataKey={labelKey}
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {liveData ? "Live data" : "Sample data"}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {liveData
            ? `Total: ${total} users`
            : "Showing sample browser usage data"}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CircleChart;
