import Link from "next/link";
import { cn } from "@/lib/utils";

export function Chip({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex h-11 shrink-0 items-center gap-1.5 rounded-full px-5 font-semibold transition-colors",
        active ? "bg-text text-bg" : "bg-surface-2 text-text/80 hover:bg-white/10",
      )}
    >
      {children}
    </Link>
  );
}
