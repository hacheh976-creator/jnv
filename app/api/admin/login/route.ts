import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, adminCookieOptions, createAdminToken } from "@/lib/auth";
import { adminDb } from "@/lib/supabase/admin";
import { verifyPassword } from "@/lib/password";

const Body = z.object({ password: z.string().min(1).max(200) });
const WINDOW_MIN = 15;
const MAX_FAILS = 5;

async function ipHash(req: Request) {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const data = new TextEncoder().encode(`${ip}:${process.env.ADMIN_JWT_SECRET ?? ""}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const started = Date.now();
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Password dah rawh" }, { status: 400 });

  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored || !process.env.ADMIN_JWT_SECRET) {
    return NextResponse.json({ error: "Admin password la set lo (ADMIN_PASSWORD_HASH)" }, { status: 500 });
  }

  const db = adminDb();
  const ip = await ipHash(req);
  const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();

  // clean old rows, then count recent failures
  await db.from("login_attempts").delete().lt("attempted_at", new Date(Date.now() - 86_400_000).toISOString());
  const { count } = await db
    .from("login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ip)
    .gte("attempted_at", since);
  if ((count ?? 0) >= MAX_FAILS) {
    return NextResponse.json({ error: "Tum tam lutuk. Minute 15 hnuah tum leh rawh." }, { status: 429 });
  }

  const ok = await verifyPassword(parsed.data.password, stored);
  if (!ok) {
    await db.from("login_attempts").insert({ ip_hash: ip });
    await sleep(Math.max(0, 500 - (Date.now() - started)));
    return NextResponse.json({ error: "Password a dik lo" }, { status: 401 });
  }

  await db.from("login_attempts").delete().eq("ip_hash", ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createAdminToken(), adminCookieOptions);
  return res;
}
