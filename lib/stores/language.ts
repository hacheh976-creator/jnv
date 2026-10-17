"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "miz" | "hi";

type LanguageState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "en", // English is the default language
      setLang: (lang) => set({ lang }),
    }),
    {
      name: "jnv_lang_v1",
    }
  )
);
