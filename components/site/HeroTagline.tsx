"use client";
import { useTranslation } from "@/lib/i18n";

export function HeroTagline({ defaultTagline }: { defaultTagline?: string }) {
  const { t, lang } = useTranslation();

  let text = t("heroTagline", "Student-made games & AI songs");
  if (lang === "miz") {
    text = defaultTagline || t("heroTagline", "Kan naupangte siam game leh hla");
  }

  return (
    <p className="mx-auto mt-3 max-w-md text-base font-medium text-white/85 drop-shadow sm:text-lg">
      {text}
    </p>
  );
}
