# Matrix37 — Version10

المصدر: `5a30d82d18b3c74726360e901711c14f8e3bed51`. الحالات الإجماليةلم تتغير:4 VERIFIED SAMPLE /32 PARTIAL /1 NOT COMPLETE. لا يُعد فتح قسم اكتمالاً لوظائفه.

كل صف يفصل مطابقة المصدر عن التفاعل، والبصريات، والاستجابة، والخادم في [JSON](coverage-37.json). المقاسات المطلوبة وSafari الفعلي NOT TESTED؛ كل الربط الخادمي/RBAC غير مختبر.

|البند|الوظيفة|الحالة|المصدر/المكون|دليل هذه الدفعة وحدوده|
|---|---|---|---|---|
|FP01|الرئيسية والمؤشرات الأربع|VERIFIED SAMPLE|A vOrders; B preview.tsx SummaryCards; native/index.tsx + b-shell/summary-cards.tsx|Final-home retains four original indicators. U08 density remains partial.|
|FP02|حالة السائقين والمتاجر|PARTIAL|A livePills/goLive; native/operational-alerts.tsx + order-operations.ts|All/on/off desktop results and audited data tests pass; no all-device guarantee.|
|FP03|التنبيهات التشغيلية|PARTIAL|A alerts/lowAlert/noCourier; native/operational-alerts.tsx|74px earlier first record; alert information/action preserved; not full alert-journey proof.|
|FP04|التنقل الرئيسي|VERIFIED SAMPLE|A tabKeep/render; B AdminLayout/AppSidebar/AppHeader; native/b-shell/* + navigation.ts|Desktop lists and Back observed; mobile navigation NOT TESTED.|
|FP05|بحث الطلبات|PARTIAL|A oqSet/oqRun; B OrdersList search; native/domain.ts + b-shell/list-patterns.tsx|8 data checks and10list checks; desktop phone isolation/status/reset observed.|
|FP06|حالات الطلب|PARTIAL|A order status enum; B OrdersList/OrderStatusBadge; native/b-shell/list-patterns.tsx + integrated-review/order-status.tsx|Prior7states evidence retained; affected Delivered/filter regression passed.|
|FP07|الفترة والفرز والفلاتر الثانوية|PARTIAL|B OrdersList secondary filters; A native row fields; native/domain.ts secondaryFilter + b-shell/list-patterns.tsx|10list journey checks rerun successfully; prior v8 browser invalid dates/intersection/clearing retained.|
|FP08|بطاقة الطلب|PARTIAL|A vOrders; B OrdersList table/cards; native/b-shell/list-patterns.tsx|Desktop records observed; U08 row height unchanged180.5/181; phone NOT TESTED.|
|FP09|الرجوع وحالة البحث|PARTIAL|A openOrd/ordBack/hsBack; B useListing; native/navigation.ts + b-route.ts|10list journey checks PASS; driver search/off filter/back/reload and draft preservation observed.|
|FP10|تفاصيل الطلب والأطراف|PARTIAL|A vDetail/assignModal/doAssign; selected C party order; native/order-details.tsx + assignment-dialog.tsx|Adapter cases PASS; order list/details identity matched in desktop; no real call.|
|FP11|الأصناف والمجموع|PARTIAL|A vDetail order items/options/totals; native/order-details.tsx|Prior scoped evidence retained; no new blanket PASS.|
|FP12|الدفع والتحصيل والتسوية|PARTIAL|A finBox; original mutation contracts; native/order-details.tsx + domain.ts finance|Prior scoped evidence retained; no new blanket PASS.|
|FP13|Timeline والمحادثة|PARTIAL|A vDetail Timeline/cmtParts; B Accordion; native/order-details.tsx|Prior scoped evidence retained; no new blanket PASS.|
|FP14|قائمة المنشآت|PARTIAL|A vStores/srqCard/tarCard; B Grid/Forms; native/entity-sections.tsx restaurants + b-shell/entity-grid.tsx|final-stores screenshot and SSR; full merchant action parity still partial.|
|FP15|تعديل المنشأة والملكية|PARTIAL|A vStoreEdit/saveStore/edOwner/edCover/edLogo/edLoc; native/entity-sections.tsx + native-form.tsx|Validation14 and SSR; no real ownership/image change or backend proof.|
|FP16|القوائم والأصناف والفروع والساعات|NOT COMPLETE|A brCard/brAtt/brDet/brNew; approveItem in vStores/core; native/mutation-service.js; merchant brand summary only|Prior scoped evidence retained; no new blanket PASS.|
|FP17|السائق: موافقة واتصال وآخر ظهور|PARTIAL|A vDrivers/vDrvEdit/driver activity; native/entity-sections.tsx drivers + order-operations.ts|Data tests and desktop All/on/off/name search PASS; approval write remains simulation only.|
|FP18|السائق: النقد والحد والإيقاف|PARTIAL|A driver cash/limit/accept_blocked; native/entity-sections.tsx + operational-alerts.tsx|Boundary adapter test and desktop1250/1000 warning PASS; server permission not tested.|
|FP19|تعديل السائق واستلام النقد|PARTIAL|A openDrvEdit/saveLimit/settle/drvAct; native/native-form.tsx + mutation-action.tsx + mutation-service.js|Draft1100 retained after refusedSave/cancel/reopen/reload; confirmation opened/cancelled. No live write.|
|FP20|بيانات قائمة السائقين التجريبية|PARTIAL|A vDrivers and preserved sample data; native/fixture.json + entity-sections.tsx role filter|Prior scoped evidence retained; no new blanket PASS.|
|FP21|العملاء والملفات|PARTIAL|A vCustomers/cuOpen/cuPhone/cuBan; native/entity-sections.tsx + native-form.tsx|final-customers; no false Address; edit/helper regression only, not full customer parity.|
|FP22|المحفظة وحركاتها|PARTIAL|A cuWal; selected C wallet position; native/entity-sections.tsx + native-form.tsx|Prior scoped evidence retained; no new blanket PASS.|
|FP23|سجل طلبات العميل|VERIFIED SAMPLE|A cuMore/customer order history; native/entity-sections.tsx history helper|Prior scoped evidence retained; no new blanket PASS.|
|FP24|الإشعارات والجرس|PARTIAL|B NotificationDropdown/NotificationsPage/useReadNotices; layout/header/notification-dropdown + workspace.tsx + native/notifications.ts + b-route.ts|Prior scoped evidence retained; no new blanket PASS.|
|FP25|الدعم والشكاوى|PARTIAL|A vSupportA/vTicketA/tkSendA; native/ticket-details.tsx + entity-sections.tsx|12support handler checks PASS, final-support screenshot. v7 clear-only-on-success and return retained.|
|FP26|الإلغاء والاسترداد والإرجاع|PARTIAL|A refundBox/tkStatus/ticketSetStatus; native/ticket-details.tsx + mutation-service.js|Support/validation/operations simulated checks PASS; backend financial success NOT TESTED.|
|FP27|التقييمات والجودة|PARTIAL|public/operations-source/admin.html: avg/lowOf/needR/cmtParts/vRatings/ratingBlock/resModal/saveRes (463,474–492); native/ratings-data.ts + entity-sections.tsx; existing B SummaryCards/Select/NativeGrid/Card/Badge/NativeForm/MutationAction|12parity+6action+4state+SSR checks PASS; final-ratings; v8 linked-back evidence retained.|
|FP28|البانرات|PARTIAL|A vBanners/vBannerEdit/bannerSave/pickLink; native/entity-sections.tsx banners + native-form.tsx|Data/SSR PASS; final-banners. Entire banner CRUD not established.|
|FP29|العروض والولاء|PARTIAL|A vPromos/vLoyalty/lySave/heSave/storeLoy; native/entity-sections.tsx promotions/loyalty|AuditSSR and validation PASS; final-promotions/loyalty; complete campaigns/loyalty backend not proven.|
|FP30|المالية والإيصالات والمصروفات|PARTIAL|A finBox/settle; B AnalyticsDashboard finances; native/order-details.tsx + analytics.tsx|Prior scoped evidence retained; no new blanket PASS.|
|FP31|التقارير والتحليلات|PARTIAL|B analytics.tsx/analytics-data.ts complete source; AnalyticsDashboard + native B SummaryCards adapter|Prior scoped evidence retained; no new blanket PASS.|
|FP32|الأدوار والصلاحيات|PARTIAL|A vStaff/stfSave/stfActive/stfRm; native/entity-sections.tsx staff + mutation-service.js|Prior scoped evidence retained; no new blanket PASS.|
|FP33|سجل العمليات والأخطاء|PARTIAL|A loadLog/vLog; core audit/clientErrors; native/entity-sections.tsx log + log-data.ts + existing B Card/Field/Button|Prior scoped evidence retained; no new blanket PASS.|
|FP34|النصوص والإعدادات|PARTIAL|A vTexts/pgSave/setPage; B SettingsPage; native/entity-sections.tsx + b-shell/settings.tsx|SSR summaries/closed forms PASS; final-texts. Full setting behavior still partial.|
|FP35|اللغات والوضع الداكن|PARTIAL|B settings + context/theme-context.tsx + messages; native-preview/main.tsx + b-shell/settings.tsx + ThemeProvider|Desktop EN/RU/TG Light/Dark/Auto switching and persistence observed; no full translation/phone certification.|
|FP36|الألوان والشعار والمكونات|PARTIAL|B original shell/primitives/icons; approved orange/logo; native/b-shell + components/ui + original logo|Desktop evidence and affected SSR PASS; U08partial,U13/U14partial verification; owner visual acceptance pending.|
|FP37|صفحات TailAdmin الإضافية|VERIFIED SAMPLE|Original B template demonstration routes; preserved src/app reference pages, excluded native sidebar|Prior scoped evidence retained; no new blanket PASS.|

الفجوات السابقة لكل وظيفة محفوظة دون حذف فيevidence_and_gap وv8_dimensions داخلJSON. U08 remains PARTIAL; FP16 remains blocked.

النواقص المشتركة: viewport runner مصرح للمقاسات المطلوبة؛ Safari حقيقي؛ قبول المالك؛ TG fallback؛ ربط خادمي وصلاحيات غير مدعاة؛ بقية النقل الوظيفي حسب الصف، لا حسب وجود المكون.
