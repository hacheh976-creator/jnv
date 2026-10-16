import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// All pages are rendered on request (fresh data from Supabase), so no
// incremental cache bucket is needed.
export default defineCloudflareConfig({});
