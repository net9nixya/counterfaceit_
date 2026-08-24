import { NextRequest, NextResponse } from "next/server";
import { demoProfile, topBoards } from "../../../lib/demo";

export async function GET(req: NextRequest, { params }: { params: { nickname: string } }) {
  const base = process.env.COUNTER_FACEIT_API_URL;
  const secret = process.env.COUNTER_FACEIT_API_SECRET;
  const initData = req.headers.get("x-telegram-init-data") || "";
  const nickname = decodeURIComponent(params.nickname);

  if (base) {
    const r = await fetch(`${base}/profile/${encodeURIComponent(nickname)}`, {
      headers: {
        "X-Telegram-Init-Data": initData,
        Authorization: secret ? `Bearer ${secret}` : "",
      },
      cache: "no-store",
    });
    if (r.status === 404) return NextResponse.json({ error: "Игрок не найден" }, { status: 404 });
    if (!r.ok) return NextResponse.json({ error: "Profile API error" }, { status: 502 });
    return NextResponse.json(await r.json());
  }

  // demo fallback: если кликнули на demo-ник weralow — вернём demo-профиль,
  // иначе просто отдаём тот же demo-профиль с подменённым ником, чтобы
  // экран профиля можно было проверить визуально без реального бэкенда.
  if (nickname.toLowerCase() === demoProfile.nickname.toLowerCase()) {
    return NextResponse.json(demoProfile);
  }
  const foundEntry = topBoards.flatMap((b) => b.entries).find((e) => e.nickname.toLowerCase() === nickname.toLowerCase());
  if (!foundEntry) return NextResponse.json({ error: "Игрок не найден" }, { status: 404 });

  return NextResponse.json({
    ...demoProfile,
    nickname: foundEntry.nickname,
    username: foundEntry.nickname,
    verified: foundEntry.verified,
    badges: [],
    matches: [],
    medals: [],
  });
}
