"use client";
import { Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function SearchHeader() {
  const { t } = useTranslation();
  return <h1 className="font-display text-4xl font-extrabold">{t("search", "Search")}</h1>;
}

export function SearchForm({ defaultValue }: { defaultValue?: string }) {
  const { t } = useTranslation();
  return (
    <form action="/search" className="relative mt-4" role="search">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={22} />
      <input
        name="q"
        defaultValue={defaultValue}
        autoFocus={!defaultValue}
        enterKeyHint="search"
        placeholder={t("searchQueryPlaceholder", "Game or song name...")}
        className="h-14 w-full rounded-full border border-line bg-surface pl-12 pr-28 text-lg outline-none focus:border-saffron"
      />
      <button className="absolute right-2 top-1/2 h-11 -translate-y-1/2 rounded-full bg-saffron px-5 font-bold text-black transition-transform duration-75 active:scale-95 touch-manipulation">
        {t("searchQueryBtn", "Search")}
      </button>
    </form>
  );
}

export function SearchNotFound({ query }: { query: string }) {
  const { lang } = useTranslation();
  if (lang === "miz") {
    return <p className="mt-10 text-center text-lg text-muted">“{query}” hi kan hmu lo. Thumal dang hmang rawh.</p>;
  }
  if (lang === "hi") {
    return <p className="mt-10 text-center text-lg text-muted">“{query}” के लिए कोई परिणाम नहीं मिला। कृपया दूसरा शब्द आज़माएँ।</p>;
  }
  return <p className="mt-10 text-center text-lg text-muted">No results found for “{query}”. Try another keyword.</p>;
}

export function SearchSectionTitle({ type }: { type: "games" | "music" }) {
  const { t } = useTranslation();
  return (
    <h2 className="mb-4 font-display text-2xl font-extrabold">
      {type === "games" ? t("games", "Games") : t("music", "Music")}
    </h2>
  );
}
