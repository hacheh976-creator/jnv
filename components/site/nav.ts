import { Gamepad2, Home, Music2, Search } from "lucide-react";

export const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Game", icon: Gamepad2 },
  { href: "/music", label: "Hla", icon: Music2 },
  { href: "/search", label: "Zawng", icon: Search },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
