"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, isActive } from "./nav";
import { AdminLogin } from "./AdminLogin";
import { InstallButton } from "./InstallButton";
import { cn } from "@/lib/utils";

export function Header({ schoolName }: { schoolName: string }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [login, setLogin] = useState(false);
  const taps = useRef<number[]>([]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onLogoTap() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 3000), now];
    try {
      navigator.vibrate?.(10);
    } catch {}
    if (taps.current.length >= 5) {
      taps.current = [];
      setLogin(true);
    }
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-white/5 bg-bg/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-transform duration-300",
          hidden && "-translate-y-full",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <button
            onClick={onLogoTap}
            aria-label="JNV logo"
            className="brand-gradient grid h-11 w-11 shrink-0 place-items-center rounded-full p-[2px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-160.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full bg-white" />
          </button>
          <Link href="/" className="min-w-0 leading-tight">
            <span className="block font-display text-xl font-extrabold tracking-tight">
              JNV <span className="brand-text">Studio</span>
            </span>
            <span className="block truncate text-[11px] text-muted">{schoolName}</span>
          </Link>

          <nav aria-label="Main" className="ml-8 hidden lg:block">
            <ul className="flex gap-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-11 items-center gap-2 rounded-full px-4 font-semibold transition-colors",
                        active ? "bg-saffron/15 text-saffron" : "text-muted hover:bg-white/5 hover:text-text",
                      )}
                    >
                      <Icon size={20} /> {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto">
            <InstallButton />
          </div>
        </div>
      </header>
      <AdminLogin open={login} onClose={() => setLogin(false)} />
    </>
  );
}
