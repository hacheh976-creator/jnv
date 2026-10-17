"use client";
import { useTranslation } from "@/lib/i18n";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="grid min-h-[60dvh] place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">{t("errorTitle", "Something went wrong")}</h1>
        <p className="mt-1 text-muted">{t("errorDesc", "Check your internet connection and try again")}</p>
        <button
          onClick={reset}
          className="mt-5 h-12 rounded-full bg-saffron px-6 font-bold text-black transition-transform duration-75 active:scale-95 touch-manipulation"
        >
          {t("retry", "Try again")}
        </button>
      </div>
    </div>
  );
}
