import { Gamepad2, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Cover image, or a branded gradient placeholder when there is none. */
export function Cover({
  src,
  alt,
  accent,
  kind = "game",
  className,
  priority,
}: {
  src: string | null;
  alt: string;
  accent: string;
  kind?: "game" | "music";
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={512}
        height={512}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn("h-full w-full object-cover", className)}
        style={{ backgroundColor: accent }}
      />
    );
  }
  const Icon = kind === "game" ? Gamepad2 : Music2;
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative grid h-full w-full place-items-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(circle at 30% 20%, ${accent}ee, ${accent}66 45%, #0b0b12 100%)`,
      }}
    >
      <Icon className="h-1/3 w-1/3 text-white/30" strokeWidth={1.5} />
    </div>
  );
}
