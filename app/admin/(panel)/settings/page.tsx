import { KeyRound } from "lucide-react";
import { adminDb } from "@/lib/supabase/admin";
import { PageTitle } from "@/components/admin/PageTitle";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { SiteSettings } from "@/lib/types";

export default async function Settings() {
  const { data } = await adminDb().from("site_settings").select("site_name,school_name,tagline").eq("id", 1).maybeSingle();
  return (
    <>
      <PageTitle title="Settings" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SettingsForm initial={(data as SiteSettings) ?? { site_name: "JNV Studio", school_name: "", tagline: "" }} />
        <div className="rounded-3xl bg-surface p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold"><KeyRound size={20} /> Admin password thlak dan</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-text/85">
            <li>Computer-ah project folder-ah <code className="rounded bg-white/10 px-1">pnpm hash-password</code> run rawh.</li>
            <li>Password thar ziak la, a chhuak <code className="rounded bg-white/10 px-1">ADMIN_PASSWORD_HASH</code> leh <code className="rounded bg-white/10 px-1">ADMIN_JWT_SECRET</code> copy rawh.</li>
            <li>Cloudflare → Workers → <b>jnv-studio</b> → Settings → Variables and Secrets-ah thlak rawh.</li>
            <li>Deploy leh rawh. Password hlui a hman theih tawh lo ang.</li>
          </ol>
        </div>
      </div>
    </>
  );
}
