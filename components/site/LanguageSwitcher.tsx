"use client";
import { useLanguage, type Lang } from "@/lib/stores/language";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "miz", label: "MIZ", name: "Mizo" },
  { code: "hi", label: "HI", name: "हिन्दी" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-surface-2/90 p-0.5 text-xs font-semibold shadow-sm",
        className
      )}
    >
      <span className="grid h-6 w-6 place-items-center pl-1 text-muted" aria-hidden>
        <Globe size={13} />
      </span>
      {LANGS.map((item) => {
        const active = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            aria-pressed={active}
            title={item.name}
            className={cn(
              "h-7 rounded-full px-2.5 text-xs font-bold transition-transform duration-75 active:scale-95 touch-manipulation",
              active
                ? "bg-saffron text-black shadow-sm"
                : "text-muted hover:text-white"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
