// Isolated public evidence viewer. Immutable source; no live data or bindings.
const SOURCE = 'https://raw.githubusercontent.com/merapplications-sketch/talabot-tailadmin-review/b034238e158243c7a38456dccd3e62e0ab7c535f/public/review-gallery/';
const TYPES = {html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json',png:'image/png',zip:'application/zip'};
export default {
  async fetch(request) {
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405});
    const url = new URL(request.url);
    const path = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    if (!/^(?:index\.html|gallery\.(?:js|css)|manifest\.json|TALABOT-visual-review-evidence\.zip|images\/(?:live\/)?[a-z0-9-]+\.png)$/.test(path)) return new Response('Not found',{status:404});
    const response = await fetch(SOURCE + path, {method:request.method,cf:{cacheTtl:3600,cacheEverything:true}});
    const headers = new Headers(response.headers);
    headers.set('Content-Type',TYPES[path.split('.').pop()] || 'application/octet-stream');
    headers.set('X-Content-Type-Options','nosniff');
    headers.set('Referrer-Policy','no-referrer');
    headers.set('Content-Security-Policy',"default-src 'none'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    headers.set('Cache-Control', response.ok ? 'public, max-age=300' : 'no-store');
    return new Response(response.body,{status:response.status,headers});
  }
};
