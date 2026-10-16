// Helpers for serving student game HTML safely.

/** Gives games an in-memory localStorage when the sandbox blocks the real one. */
export const STORAGE_SHIM = `<script>(function(){function m(){var d={};return{getItem:function(k){return Object.prototype.hasOwnProperty.call(d,k)?d[k]:null},setItem:function(k,v){d[k]=String(v)},removeItem:function(k){delete d[k]},clear:function(){d={}},key:function(i){return Object.keys(d)[i]||null},get length(){return Object.keys(d).length}}}["localStorage","sessionStorage"].forEach(function(n){try{window[n].getItem("x")}catch(e){try{Object.defineProperty(window,n,{value:m(),configurable:true})}catch(_){}}})})();</script>`;

export function withShim(html: string) {
  const i = html.search(/<head[^>]*>/i);
  if (i >= 0) {
    const end = html.indexOf(">", i) + 1;
    return html.slice(0, end) + STORAGE_SHIM + html.slice(end);
  }
  return STORAGE_SHIM + html;
}

/**
 * The `sandbox` directive makes the browser treat this document as a unique,
 * opaque origin — even if someone opens the URL directly — so game code can
 * never read our cookies or call the admin API.
 */
export const GAME_HEADERS: Record<string, string> = {
  "Content-Type": "text/html; charset=utf-8",
  "Content-Security-Policy":
    "sandbox allow-scripts allow-pointer-lock allow-popups allow-modals allow-forms allow-orientation-lock; default-src * data: blob: 'unsafe-inline' 'unsafe-eval'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};
