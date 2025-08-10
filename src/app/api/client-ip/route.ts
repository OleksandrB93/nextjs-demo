import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get client IP from external service
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();

    return NextResponse.json({
      ip: data.ip,
      success: true,
    });
  } catch (error) {
    console.error("Failed to get client IP:", error);
    return NextResponse.json(
      {
        ip: null,
        success: false,
        error: "Failed to get IP",
      },
      { status: 500 }
    );
  }
}
