"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation, type TranslationKey } from "@/lib/i18n";

export function Section({
  title,
  titleKey,
  href,
  children,
  icon,
}: {
  title: string;
  titleKey?: TranslationKey;
  href?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const displayTitle = titleKey ? t(titleKey, title) : title;

  return (
    <section className="mt-10 px-4">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold">
          {icon}
          {displayTitle}
        </h2>
        {href && (
          <Link
            href={href}
            className="flex h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold text-saffron transition-colors duration-75 hover:bg-saffron/10 touch-manipulation"
          >
            {t("viewAll", "View all")} <ChevronRight size={18} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function DemoBanner() {
  const { lang } = useTranslation();
  if (lang === "hi") {
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-yellow/30 bg-yellow/10 p-4 text-sm text-yellow">
        <b>डेमो मोड:</b> Supabase अभी कनेक्ट नहीं है। ये खेल और गाने केवल उदाहरण हैं।
      </div>
    );
  }
  if (lang === "miz") {
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-yellow/30 bg-yellow/10 p-4 text-sm text-yellow">
        <b>Demo mode:</b> Supabase la connect lo a ni. Heng game leh hla te hi entirna chauh an ni.
      </div>
    );
  }
  return (
    <div className="mx-4 mt-4 rounded-2xl border border-yellow/30 bg-yellow/10 p-4 text-sm text-yellow">
      <b>Demo mode:</b> Supabase is not connected yet. These sample games and songs are for demonstration.
    </div>
  );
}
