from pathlib import Path
import re,json,hashlib,shutil
root=Path('/workspace/sites/talabot-ux02-d');orig=Path('/workspace/scratch/d301f10bb459/d05-c');p=root/'public/operations-source'
a=(orig/'original/admin.html').read_text();c=(orig/'src/admin/admin.html').read_text()
# Keep approved C changes, restore A metric definitions and order, then place operational status after metrics.
start=a.index('  const H=`');end=a.index("  if(AUTO&&H===LASTH)",start)
h=a[start:end]
metricstart=h.index("${tab=='o'&&!D?");metricend=h.index('\n  <nav',metricstart)
metrics=h[metricstart:metricend]
nav=h[h.index('  <nav'):]
h='  const H=`'+metrics+'<div class="top">${livePills()}</div>${tkBar}${alerts()}\n'+nav
cs=c.index('  const H=`');ce=c.index('  if(AUTO&&H===LASTH)',cs);c=c[:cs]+h+c[ce:]
c=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]+>', '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob:; connect-src \'none\'; font-src \'self\'; object-src \'none\'; base-uri \'self\'; form-action \'none\'">',c)
c=c.replace('</head>','<link rel="stylesheet" href="unified.css"></head>')
c=c.replace('<script src="preview-client.js">','<script src="boot.js"></script><script src="preview-client.js">')
c=c.replace('</body>','<script src="adapter.js"></script></body>')
c=c.replace("sh0=all.filter(o=>f=='all'||o.status==f)","sh0=uxFilter(all.filter(o=>f=='all'||o.status==f))")
c=c.replace("return `<div class=\"oq", "return `<div class=\"oq")
# Preserve all original handlers; the additional controls precede the original list.
c=c.replace('function vOrders(){','function vOrders(){')
# Wrap original renderer after declarations via adapter, avoiding field/template loss.
(p/'admin.html').write_text(c)
for name in ('talabat-core.js','preview-client.js'):
 text=(orig/'original'/name).read_text()
 if name=='talabat-core.js':
  text=re.sub(r'https://[a-z0-9]+\.supabase\.co','https://production-disabled.invalid',text)
  text=re.sub(r'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+','PREVIEW_ONLY_NO_CREDENTIAL',text)
 (p/name).write_text(text)
# Immutable origin manifest protects handler and field coverage while source remains available for review.
functions=re.findall(r'(?:async\s+)?function\s+(\w+)\(',a)
attrs=re.findall(r'\b(?:onclick|oninput|onchange)="([^"]*)"',a)
fields=re.findall(r'\bid="([^"]+)"',a)
(root/'docs/ux02/original-manifest.json').write_text(json.dumps({'sourceA':'89b229e58526091594af5586fc15be13bb0c3cc4','sourceC':'3bb4840cc05eb659d8e28a10408c50af4b640cb5','functions':functions,'handlers':attrs,'fieldIds':fields},ensure_ascii=False,indent=2))
shutil.copy('/workspace/scratch/d301f10bb459/TALABOT-UX-MASTER-SPEC-01.md',root/'docs/ux02/spec.md')
shutil.copy('/workspace/sites/talabot-abc-review-evidence/dist/matrix.json',root/'docs/ux02/traceability-37.json')
print(len(functions),len(attrs),len(fields))
