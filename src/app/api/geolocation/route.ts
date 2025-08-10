import { NextRequest, NextResponse } from "next/server";
import requestIp from "request-ip";

// free geolocation API with fallback services
async function getLocationFromIP(ip: string) {
  // try different services one by one
  const services = [
    {
      name: "ipapi.co",
      url: `https://ipapi.co/${ip}/json/`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser: (data: any) => ({
        country: data.country_name || "Unknown",
        city: data.city || "Unknown",
        region: data.region || "Unknown",
        timezone: data.timezone || "Unknown",
      }),
    },
    {
      name: "ip-api.com",
      url: `http://ip-api.com/json/${ip}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser: (data: any) => ({
        country: data.country || "Unknown",
        city: data.city || "Unknown",
        region: data.regionName || "Unknown",
        timezone: data.timezone || "Unknown",
      }),
    },
    {
      name: "ipinfo.io",
      url: `https://ipinfo.io/${ip}/json`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser: (data: any) => ({
        country: data.country || "Unknown",
        city: data.city || "Unknown",
        region: data.region || "Unknown",
        timezone: data.timezone || "Unknown",
      }),
    },
  ];

  for (const service of services) {
    try {
      console.log(`Trying ${service.name} for IP ${ip}`);
      const response = await fetch(service.url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`${service.name} response:`, data);

      const location = service.parser(data);

      // check if we got any data
      if (location.country !== "Unknown" || location.city !== "Unknown") {
        console.log(
          `Successfully got location from ${service.name}:`,
          location
        );
        return location;
      }
    } catch (error) {
      console.error(`Failed to get location from ${service.name}:`, error);
      continue; // try next service
    }
  }

  // if all services failed
  console.log("All geolocation services failed, returning default values");
  return {
    country: "Unknown",
    city: "Unknown",
    region: "Unknown",
    timezone: "Unknown",
  };
}

export async function POST(request: NextRequest) {
  try {
    // first check if there is a custom location
    try {
      const customLocationResponse = await fetch(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/api/set-location`
      );
      const customLocationData = await customLocationResponse.json();

      if (customLocationData.success && customLocationData.hasCustomLocation) {
        console.log("Using custom location:", customLocationData.location);
        return NextResponse.json({
          ip: "custom",
          detectedIp: "custom",
          isLocalhost: false,
          location: customLocationData.location,
          success: true,
          isCustomLocation: true,
        });
      }
    } catch (error) {
      console.log("No custom location set, proceeding with IP detection");
    }

    // try different ways to get IP
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientIp = requestIp.getClientIp(request as any);

    // additional attempts to get IP
    if (!clientIp) {
      clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-client-ip");
    }

    console.log("Detected IP:", clientIp);

    // for local development use test IP
    const isLocalhost =
      !clientIp ||
      clientIp === "127.0.0.1" ||
      clientIp === "::1" ||
      clientIp === "localhost" ||
      clientIp.startsWith("192.168.") ||
      clientIp.startsWith("10.") ||
      clientIp.startsWith("172.");

    // if this is localhost, try to get real IP through external service
    let ip = clientIp || "8.8.8.8";

    if (isLocalhost) {
      console.log("Localhost detected, trying to get real IP...");
      try {
        const realIpResponse = await fetch("https://api.ipify.org?format=json");
        const realIpData = await realIpResponse.json();
        if (realIpData.ip) {
          ip = realIpData.ip;
          console.log("Got real IP from ipify.org:", ip);
        } else {
          console.log("Failed to get real IP, using fallback");
          ip = "8.8.8.8"; // Google DNS for testing
        }
      } catch (error) {
        console.log("Error getting real IP, using fallback:", error);
        ip = "8.8.8.8";
      }
    }

    console.log("Using IP for geolocation:", ip);

    const location = await getLocationFromIP(ip);

    return NextResponse.json({
      ip: clientIp,
      detectedIp: ip,
      isLocalhost,
      location,
      success: true,
      headers: {
        "x-forwarded-for": request.headers.get("x-forwarded-for"),
        "x-real-ip": request.headers.get("x-real-ip"),
        "cf-connecting-ip": request.headers.get("cf-connecting-ip"),
      },
    });
  } catch (error) {
    console.error("Geolocation API error:", error);
    return NextResponse.json(
      {
        error: "Failed to get location",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
