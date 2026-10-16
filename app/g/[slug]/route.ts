import { getGameCode } from "@/lib/queries";
import { GAME_HEADERS, withShim } from "@/lib/game-html";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: RouteContext<"/g/[slug]">) {
  const { slug } = await ctx.params;
  const game = await getGameCode(slug);
  if (!game) return new Response("Game not found", { status: 404 });
  return new Response(withShim(game.html_code), {
    headers: { ...GAME_HEADERS, "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
