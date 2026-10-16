"use client";
import { forwardRef } from "react";
import { create } from "zustand";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-3xl border border-white/5 bg-surface p-5", className)}>{children}</div>;
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-line bg-surface-2 px-4 text-base outline-none transition-colors placeholder:text-muted/60 focus:border-saffron";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...p },
  ref,
) {
  return <input ref={ref} {...p} className={cn(inputCls, "h-12", className)} />;
});

export function Textarea({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={cn(inputCls, "min-h-28 py-3", className)} />;
}

export function Select({ className, children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...p} className={cn(inputCls, "h-12 appearance-none", className)}>
      {children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-surface-2 px-4 py-3 text-left"
    >
      <span>
        <span className="block font-semibold">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <span className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", checked ? "bg-green" : "bg-white/15")}>
        <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white transition-all", checked ? "left-6" : "left-1")} />
      </span>
    </button>
  );
}

export function Button({
  variant = "primary",
  className,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "success" }) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 font-bold transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-saffron text-black hover:brightness-110",
        variant === "success" && "bg-green text-white hover:brightness-110",
        variant === "ghost" && "bg-surface-2 text-text hover:bg-white/10",
        variant === "danger" && "bg-red/15 text-red hover:bg-red/25",
        className,
      )}
    />
  );
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          type="button"
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-12 flex-1 rounded-2xl font-bold transition-colors",
            value === o.value ? "bg-saffron text-black" : "bg-surface-2 text-muted hover:text-text",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- toast ----------
type Toast = { id: number; text: string; kind: "ok" | "error" };
const useToasts = create<{ list: Toast[]; push: (t: Omit<Toast, "id">) => void }>((set) => ({
  list: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ list: [...s.list, { ...t, id }] }));
    setTimeout(() => set((s) => ({ list: s.list.filter((x) => x.id !== id) })), 3500);
  },
}));

export const toast = {
  ok: (text: string) => useToasts.getState().push({ text, kind: "ok" }),
  error: (text: string) => useToasts.getState().push({ text, kind: "error" }),
};

export function Toaster() {
  const list = useToasts((s) => s.list);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
      {list.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "anim-pop flex items-center gap-2 rounded-full px-5 py-3 font-semibold shadow-2xl",
            t.kind === "ok" ? "bg-green text-white" : "bg-red text-white",
          )}
        >
          {t.kind === "ok" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function confirmDelete(what: string) {
  return window.confirm(`${what} hi paih (delete) tak tak dawn em? Tih let leh theih a ni lo.`);
}
