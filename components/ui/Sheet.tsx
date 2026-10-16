"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  label: string;
  /** "sheet" = bottom sheet on phones, centred dialog on desktop */
  variant?: "sheet" | "dialog" | "full";
  className?: string;
};

export function Sheet({ open, onClose, children, label, variant = "sheet", className }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={label}>
      <button
        aria-label="Khar rawh"
        className="anim-fade absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={panel}
        tabIndex={-1}
        className={cn(
          "absolute overflow-y-auto bg-surface outline-none",
          variant === "sheet" &&
            "anim-sheet inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl pb-[env(safe-area-inset-bottom)] md:anim-pop md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[560px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl",
          variant === "dialog" &&
            "anim-pop left-1/2 top-1/2 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-3xl",
          variant === "full" && "anim-sheet inset-0",
          className,
        )}
      >
        {variant === "sheet" && (
          <div className="sticky top-0 z-10 flex justify-center pt-3 md:hidden" aria-hidden>
            <div className="h-1.5 w-12 rounded-full bg-white/25" />
          </div>
        )}
        <button
          onClick={onClose}
          aria-label="Khar rawh"
          className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </div>
  );
}
