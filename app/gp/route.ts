import { GAME_HEADERS, STORAGE_SHIM } from "@/lib/game-html";

// Admin live preview: an empty sandboxed page that renders HTML posted to it.
const PAGE = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#0b0b12;color:#a1a1b5;font-family:system-ui;display:grid;place-items:center;height:100vh">Preview...
<script>
var SHIM = ${JSON.stringify(STORAGE_SHIM).replace(/<\//g, "<\\/")};
window.addEventListener("message", function (e) {
  if (e.source !== window.parent || !e.data || e.data.type !== "jnv-preview") return;
  var html = String(e.data.html || "");
  var i = html.search(/<head[^>]*>/i);
  html = i >= 0 ? html.slice(0, html.indexOf(">", i) + 1) + SHIM + html.slice(html.indexOf(">", i) + 1) : SHIM + html;
  document.open(); document.write(html); document.close();
});
window.parent.postMessage({ type: "jnv-preview-ready" }, "*");
</script></body></html>`;

export function GET() {
  return new Response(PAGE, { headers: { ...GAME_HEADERS, "Cache-Control": "public, max-age=3600" } });
}
