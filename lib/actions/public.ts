"use server";
import { z } from "zod";
import { publicDb, hasSupabaseEnv } from "@/lib/supabase/server";

const id = z.string().uuid();

export async function recordGamePlay(gameId: string) {
  if (!hasSupabaseEnv() || !id.safeParse(gameId).success) return;
  await publicDb().rpc("increment_game_play", { game_id: gameId });
}

export async function likeGame(gameId: string): Promise<number | null> {
  if (!hasSupabaseEnv() || !id.safeParse(gameId).success) return null;
  const { data } = await publicDb().rpc("add_game_like", { game_id: gameId });
  return typeof data === "number" ? data : null;
}

export async function recordTrackPlay(trackId: string) {
  if (!hasSupabaseEnv() || !id.safeParse(trackId).success) return;
  await publicDb().rpc("increment_track_play", { track_id: trackId });
}

export async function likeTrack(trackId: string): Promise<number | null> {
  if (!hasSupabaseEnv() || !id.safeParse(trackId).success) return null;
  const { data } = await publicDb().rpc("add_track_like", { track_id: trackId });
  return typeof data === "number" ? data : null;
}
