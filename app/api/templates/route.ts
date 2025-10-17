import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    items: [
      { id: "std-banner", name: "Standard Banner", sizes: ["2x4", "3x6", "4x8"] },
      { id: "yard-sign", name: "Yard Sign", sizes: ["18x24", "24x36"] },
    ],
  });
}
