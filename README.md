# JNV Studio

**PM SHRI School JNV Serchhip, Thenzawl** naupang Class 7–9 te siam HTML game leh Gemini hmanga hla phuah tlangzarhna website + app.

- **User side:** login ngai lo, free — game khel, hla ngaithla, phone-ah app angin install theih.
- **Admin side:** logo vawi 5 tap (3 second chhungin) → password → game, hla, album, genre, category enkawlna.

Stack: Next.js 16 · Tailwind CSS 4 · Supabase (database + file) · Cloudflare Workers (OpenNext).

---

## 1. Computer-ah run (D:\ drive)

Mamawh: [Node.js 22 LTS](https://nodejs.org), [Git](https://git-scm.com), pnpm (`npm i -g pnpm`).

```powershell
cd D:\jnv
pnpm install
copy .env.example .env.local     # a chhungah key te dah rawh (step 2 en rawh)
pnpm dev                         # http://localhost:3000
```

`.env.local` a awm loh chuan **Demo mode**-ah a kal a, entirna game leh hla a lang ang.

## 2. Supabase connect (vawi khat chauh)

1. Supabase dashboard → i project → **SQL Editor** → **New query**.
2. `supabase/migrations/0001_init.sql` chhunga thil zawng zawng copy-paste la, **Run** hmet rawh.
   (Table, RLS, Mizo/English/Hindi album, Gospel/Lengzem/Others genre, storage bucket `covers` leh `audio` a siam vek ang.)
3. **Project Settings → API Keys** atangin hei hi `.env.local` ah dah rawh:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL (`https://xxxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — *anon* / *publishable* key
   - `SUPABASE_SERVICE_ROLE_KEY` — *service_role* / *secret* key (**mi hnenah pe ngai suh**)
4. Admin password:
   ```powershell
   pnpm hash-password
   ```
   Password ziak la, a chhuak `ADMIN_PASSWORD_HASH` leh `ADMIN_JWT_SECRET` te `.env.local` ah dah rawh.
   > Public-a i tlangzarh hmain password `jnv@2026` aiin mi hriat theih loh password thar hmang rawh.

## 3. Cloudflare-ah deploy (GitHub atangin)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → `jnv` repo thlang.
2. Settings:
   - Project/Worker name: **`jnv-studio`** (`wrangler.jsonc` a hming nen a inang tur)
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
3. **Variables and Secrets** (Settings) ah dah rawh — *Build variables* ah pawh `NEXT_PUBLIC_` pahnih kha dah bawk rawh:

   | Name | Type |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Text |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Text |
   | `NEXT_PUBLIC_SITE_URL` | Text (e.g. `https://jnv-studio.xxx.workers.dev`) |
   | `SUPABASE_SERVICE_ROLE_KEY` | **Secret** |
   | `ADMIN_PASSWORD_HASH` | **Secret** |
   | `ADMIN_JWT_SECRET` | **Secret** |

4. Deploy. A hnu chuan GitHub-ah i push apiangin a in deploy nghal ang.

Computer atangin direct deploy duh chuan: `npx wrangler login` → `pnpm deploy`.
Worker build local-a test nan: `.env.local` kha `.dev.vars` ah copy la, `pnpm preview`.

## 4. Hman dan (Admin)

- **Game thar:** Admin → Game → *Game thar* → HTML code paste (emaw `.html` file upload) → Preview-ah khel chhin → Info-ah hming, siamtute (hming hmasa chauh), class, cover thlalak → **Publish**.
- **Hla thar:** Admin → Hla → album (Mizo / English / Hindi) → MP3 file pakhat emaw tam thlang → genre, class, siamtute → *Upload*.
- **Genre / Album / Category** te chu admin atangin siam, thlak, indawt rem theih.

## 5. Him nana tihdan (Security)

- Naupang game code chu `/g/<slug>` atangin `Content-Security-Policy: sandbox` nen, `iframe sandbox` chhungah a run — admin cookie emaw database a khawih thei lo.
- Admin password hi server-ah PBKDF2 hash chauh in a awm; browser code-ah a awm lo.
- Database ziahna zawng zawng hi server-ah service key hmangin, admin login hnuah chauh.
- Login tum dik lo vawi 5 hnuah minute 15 a khar.
- Naupang hming: hming hmasa + class chauh dah rawh.

## 6. Coding assistant (Claude Code / Cursor) leh MCP

- `CLAUDE.md` ah project rules a awm — assistant-in a chhiar nghal ang.
- `.mcp.example.json` kha `.mcp.json` ah copy la, Supabase token dah rawh (`.mcp.json` hi git-ah a lut lo).

## Folder

```
app/(site)/      user page: Home, Game, Hla, Zawng
app/play/        game khelhna (fullscreen)
app/g/, app/gp/  sandboxed game HTML + admin preview
app/admin/       admin panel
app/api/admin/   login / logout
components/      UI (game, music, admin, site)
lib/             database, auth, actions, helpers
supabase/        SQL migration
public/          logo, icons, service worker, offline page
```
