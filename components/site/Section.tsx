import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Section({
  title,
  href,
  children,
  icon,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <section className="mt-10 px-4">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold">
          {icon}
          {title}
        </h2>
        {href && (
          <Link href={href} className="flex h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold text-saffron hover:bg-saffron/10">
            A vaiin <ChevronRight size={18} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function DemoBanner() {
  return (
    <div className="mx-4 mt-4 rounded-2xl border border-yellow/30 bg-yellow/10 p-4 text-sm text-yellow">
      <b>Demo mode:</b> Supabase la connect lo a ni. Heng game leh hla te hi entirna chauh an ni.
      <code className="ml-1">.env.local</code> ah key dah rawh.
    </div>
  );
}
