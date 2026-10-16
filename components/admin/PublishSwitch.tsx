"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setGamePublished, setTrackPublished } from "@/lib/actions/admin";
import { toast } from "./ui";
import { cn } from "@/lib/utils";

export function PublishSwitch({ id, published, kind }: { id: string; published: boolean; kind: "game" | "track" }) {
  const [on, setOn] = useState(published);
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const next = !on;
          setOn(next);
          const r = kind === "game" ? await setGamePublished(id, next) : await setTrackPublished(id, next);
          if (!r.ok) {
            setOn(!next);
            toast.error(r.error);
          } else {
            toast.ok(next ? "Publish a ni ta!" : "Draft-ah a kir ta");
            router.refresh();
          }
        })
      }
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-bold transition-colors",
        on ? "bg-green/20 text-green" : "bg-white/10 text-muted",
      )}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", on ? "bg-green" : "bg-muted")} />
      <span className="hidden sm:inline">{on ? "Published" : "Draft"}</span>
      <span className="sm:hidden">{on ? "On" : "Off"}</span>
    </button>
  );
}
