import { NextRequest, NextResponse } from "next/server";
import { demoProfile } from "../../lib/demo";

export async function GET(req: NextRequest) {
  const base = process.env.COUNTER_FACEIT_API_URL;
  const secret = process.env.COUNTER_FACEIT_API_SECRET;
  const initData = req.headers.get("x-telegram-init-data") || "";

  if (base) {
    const r = await fetch(`${base}/profile`, {
      headers: {
        "X-Telegram-Init-Data": initData,
        Authorization: secret ? `Bearer ${secret}` : "",
      },
      cache: "no-store",
    });
    if (!r.ok) return NextResponse.json({ error: "Profile API error" }, { status: 502 });
    return NextResponse.json(await r.json());
  }

  return NextResponse.json(demoProfile);
}
