"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";

export function AdminLogin({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setPw("");
        onClose();
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Password a dik lo");
      }
    } catch {
      setError("Internet a awm lo emaw, tum leh rawh");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} label="Admin login" variant="dialog">
      <form onSubmit={submit} className="p-6 pt-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron/15 text-saffron">
            <Lock size={24} />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-muted">Password dah rawh</p>
          </div>
        </div>
        <label className="relative block">
          <span className="sr-only">Password</span>
          <input
            autoFocus
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
            className="h-14 w-full rounded-2xl border border-line bg-surface-2 px-4 pr-14 text-lg outline-none focus:border-saffron"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Thup rawh" : "En rawh"}
            className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-muted hover:text-text"
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </label>
        {error && <p className="mt-3 text-sm font-medium text-red" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={busy || !pw}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-saffron text-lg font-bold text-black disabled:opacity-50"
        >
          {busy && <Loader2 className="animate-spin" size={20} />} Lut rawh
        </button>
      </form>
    </Sheet>
  );
}
