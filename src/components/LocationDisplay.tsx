import { MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  region?: string;
  timezone?: string;
}

interface LocationDisplayProps {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const LocationDisplay = ({
  location,
  loading,
  error,
  onRefresh,
}: LocationDisplayProps) => {
  const formatLocation = (loc: LocationData) => {
    if (loc.city && loc.country) {
      return `${loc.city}, ${loc.country}`;
    }
    if (loc.country) {
      return loc.country;
    }
    return `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
  };

  const formatCoordinates = (loc: LocationData) => {
    return `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-sm">Current Location</h3>
              {loading && (
                <p className="text-xs text-muted-foreground">
                  Getting location...
                </p>
              )}
              {error && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  <span>{error}</span>
                </div>
              )}
              {location && !loading && !error && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {formatLocation(location)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCoordinates(location)}
                  </p>
                  {location.timezone && (
                    <p className="text-xs text-muted-foreground">
                      {location.timezone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
