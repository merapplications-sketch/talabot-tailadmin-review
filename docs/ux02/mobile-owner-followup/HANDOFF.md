# UX02 mobile owner follow-up — 11 Nov 2026

Base remote HEAD: bee4dc5b542d470a49cb78bc27c6958154e2263a.
Branch: review/ux02-mobile-owner-followup-20261111.
Independent Site: appgprj_6af473dde5908191b3dbf9f1b430ea78.
Owner explicitly chose access without ChatGPT login for this synthetic preview only. New Site access public, revision 2. Existing Sites unchanged.

## Owner decisions implemented
- Remove six Home shortcuts; existing operational intervention/important alerts now occupy their place. Four A metrics remain Home-only at the top.
- Existing 30.8% example monthly target also rendered on Home, with its original synthetic label, numbers and independent period rule. Reports keeps it too.
- Four B metrics stay in Reports, moved before analytics and made interactive links to corresponding native sections. Their B synthetic counts are unchanged; navigation opens A sample lists, not a fabricated matching dataset.
- Original B InputGroup holds search and orange 44px filter button. Search, popup filters and state contracts preserved.
- B accordions collapse journey, address, invoice, settlement. Mounted content, orange journey, saved invoice values and contact/map links retained.
- Driver profile renders existing avatar_url through the same identity component as list. Current synthetic driver has no avatar_url; initials remain fallback. No invented photograph; driver-upload-to-server integration NOT TESTED.
- Customer identity/phone/registration and wallet retained; admin actions grouped in one B card. Email removed from primary customer display/search label, replaced with registration date in list. No authentication, phone mutation or legacy stored email deletion.
- Driver actions wrap with consistent gaps and contact action is green.
- Native edit dialogs: viewport itself bounded to 90dvh; close button placed above scroll content; title reserves close space. Existing pending guard and drafts retained.

## Verification
Build and TypeScript PASS. Existing size/module warnings remain.
SSR composition, mobile-round, Home composition, list journeys, native operations, audit data and Home data PASS. Tests exercise synthetic/local contracts only.
Actual shared Chrome viewport: 1363×936. Four Reports links clicked and corresponding route observed; search ord0 / details / return preserves q=ord0; popup opens and closes; collapsed invoice opens to 120 - 10 + 10 + 5 = saved 125 (no formula changed).
Loyalty close X worked. Dialog viewport 842px, content 951px; keyboard focus reached footer with scrollTop109 and Close/Save visible. Browser wheel attempts did not move viewport; touch dragging NOT VERIFIED. Do not label the owner iPhone scrolling defect finally resolved.
320/390/1440 and real Safari: NOT TESTED. Browser surface provides no viewport resizing capability. Owner iPhone images are before evidence, not candidate-after QA.

## Protected matrix37
No backend/policy/permissions/finance, assignment, map contracts, pharmacy approval guards, FP07/09/27 or FP16 changes. Existing matrix acceptance is carried forward, not upgraded to 37 PASS. Only presentation/navigation checks above newly verified. No main merge or old preview changes.

## Resume
Source and publication IDs are recorded separately in PUBLISH.json after deployment. Stop at owner visual acceptance. Next: owner Safari review of public URL and touch scrolling; inspect actual driver photo transport only if separately available/authorized. Do not claim live integration from this fixture.
