import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayFrame } from "./PlayFrame";
import { getGameBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/play/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game" };
  return {
    title: game.title,
    description: game.description || `${game.title} — JNV Studio game`,
    openGraph: { title: game.title, images: game.cover_url ? [game.cover_url] : ["/icons/icon-512.png"] },
  };
}

export default async function PlayPage({ params }: PageProps<"/play/[slug]">) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();
  return (
    <PlayFrame
      id={game.id}
      slug={game.slug}
      title={game.title}
      accent={game.accent_color}
      description={game.description}
      creators={game.creators}
      cls={game.class}
    />
  );
}
