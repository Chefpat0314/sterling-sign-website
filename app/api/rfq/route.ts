import { NextRequest, NextResponse } from "next/server";

type RFQForm = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  product?: string;
  size?: string;
  notes: string;
};

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Partial<RFQForm>;

    if (!data?.name || !data?.email || !data?.notes) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, email, notes" },
        { status: 400 }
      );
    }

    // TODO: integrate with CRM/email later
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
