import { Header } from "@/components/site/Header";
import { TabBar } from "@/components/site/TabBar";
import { GameSheet } from "@/components/game/GameSheet";
import { Player } from "@/components/music/Player";
import { getCategories, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  return (
    <>
      <Header schoolName={settings.school_name} />
      <main className="mx-auto w-full max-w-7xl pb-[calc(var(--tabbar-h)+var(--player-h)+env(safe-area-inset-bottom)+24px)] lg:pb-[calc(var(--player-h)+40px)]">
        {children}
      </main>
      <TabBar />
      <GameSheet categories={catMap} />
      <Player />
    </>
  );
}
