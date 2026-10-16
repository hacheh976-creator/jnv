"use client";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button, Card, Field, Input, toast } from "./ui";
import { saveSettings } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState(initial);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await saveSettings(s);
    setBusy(false);
    if (r.ok) toast.ok("Vawn a ni ta!");
    else toast.error(r.error);
  }
  return (
    <form onSubmit={submit}>
      <Card className="space-y-4">
        <Field label="Website hming"><Input value={s.site_name} onChange={(e) => setS({ ...s, site_name: e.target.value })} maxLength={60} /></Field>
        <Field label="School hming"><Input value={s.school_name} onChange={(e) => setS({ ...s, school_name: e.target.value })} maxLength={120} /></Field>
        <Field label="Tagline" hint="Home page-a hming hnuaia thu"><Input value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} maxLength={160} /></Field>
        <Button type="submit" disabled={busy}>{busy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Vawng rawh</Button>
      </Card>
    </form>
  );
}
