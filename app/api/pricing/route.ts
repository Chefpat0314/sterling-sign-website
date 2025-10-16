import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    banners: { pricePerSqFt: 5 },
    yardSigns: { pricePerSqFt: 7 },
    decals: { pricePerSqFt: 9 },
  });
}
