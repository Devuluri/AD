import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Vaidya Sahay AI Healthcare Assistant",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
