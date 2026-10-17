import { Home, Gamepad2, Music2, Search } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

export const NAV = [
  { href: "/", key: "home" as TranslationKey, label: "Home", icon: Home },
  { href: "/games", key: "games" as TranslationKey, label: "Games", icon: Gamepad2 },
  { href: "/music", key: "music" as TranslationKey, label: "Music", icon: Music2 },
  { href: "/search", key: "search" as TranslationKey, label: "Search", icon: Search },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
