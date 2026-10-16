"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, LayoutDashboard, LogOut, Music2, Settings, Shapes, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Game", icon: Gamepad2 },
  { href: "/admin/music", label: "Hla", icon: Music2 },
  { href: "/admin/categories", label: "Category", icon: Shapes },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const active = (p: string, href: string) => (href === "/admin" ? p === "/admin" : p.startsWith(href));

export function AdminSidebar() {
  const p = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-white/5 bg-surface p-4 lg:flex">
      <div className="mb-6 flex items-center gap-3 px-2 pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-160.webp" alt="" className="h-10 w-10 rounded-full bg-white" />
        <div className="leading-tight">
          <div className="font-display text-lg font-extrabold">JNV Studio</div>
          <div className="text-xs font-bold text-saffron">Admin Panel</div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex h-12 items-center gap-3 rounded-2xl px-4 font-semibold transition-colors",
              active(p, href) ? "bg-saffron text-black" : "text-muted hover:bg-white/5 hover:text-text",
            )}
          >
            <Icon size={20} /> {label}
          </Link>
        ))}
      </nav>
      <Link href="/" target="_blank" className="flex h-12 items-center gap-3 rounded-2xl px-4 font-semibold text-muted hover:bg-white/5">
        <ExternalLink size={20} /> Website en rawh
      </Link>
      <form action="/api/admin/logout" method="post">
        <button className="flex h-12 w-full items-center gap-3 rounded-2xl px-4 font-semibold text-red hover:bg-red/10">
          <LogOut size={20} /> Chhuak rawh
        </button>
      </form>
    </aside>
  );
}

export function AdminTopBar() {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-saffron/30 bg-saffron px-4 pt-[env(safe-area-inset-top)] text-black lg:hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-160.webp" alt="" className="h-9 w-9 rounded-full bg-white" />
      <span className="font-display text-lg font-extrabold">Admin Panel</span>
      <form action="/api/admin/logout" method="post" className="ml-auto">
        <button className="flex h-10 items-center gap-1.5 rounded-full bg-black/15 px-4 text-sm font-bold" aria-label="Chhuak rawh">
          <LogOut size={18} /> Chhuak
        </button>
      </form>
    </div>
  );
}

export function AdminTabBar() {
  const p = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <ul className="grid h-16 grid-cols-5">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
                active(p, href) ? "text-saffron" : "text-muted",
              )}
            >
              <Icon size={22} /> {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
