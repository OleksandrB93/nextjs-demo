import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, TrendingUp, X } from "lucide-react";

interface CityChartProps {
  cityData: any;
  filteredCityData: any;
  cityFilter: string;
  setCityFilter: (filter: string) => void;
}

const CityChart = ({
  cityData,
  filteredCityData,
  cityFilter,
  setCityFilter,
}: CityChartProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between">
          <div>
            <CardTitle className="">🏙️ Top Cities by Activity</CardTitle>
            <CardDescription className="">
              Most active cities based on user interactions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search cities..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                      className="bg-primary h-2 rounded-full transition-all duration-300"
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
  );
};

export default CityChart;
