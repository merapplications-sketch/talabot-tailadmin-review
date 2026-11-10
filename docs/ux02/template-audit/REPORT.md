# UX-02 — B TEMPLATE FIRST / component audit

الحكم: D الحالية لا تطبّق القالب B بالكامل. إعادة استعمال الألوان وCSS لا تعادل استعمال مكوناته. المطلوب تصحيح محدود بعد موافقة المالك؛ لم تُعدّل أي واجهة في هذه المراجعة.

## المصدر وحدود الإثبات
- B المصدر: `8dc0f4c30d1a390ec1c81c440b03f5ff9c549f87`.
- D المصدر البعيد: `39c84cae9d811cee8202b94e92a594145cb11326`، الفرع `review/ux02-native-unified-20261110`، المستودع `merapplications-sketch/talabot-tailadmin-review`.
- `source-inventory.json` يسجل بصمات ملفات B مقارنة بالموجود. مكتبة `ui` والهيكل `layout` والتحليلات ومكوّن حالة الطلب موجودة دون اختلاف ضمن النطاق المفحوص؛ `talabot/preview.tsx` تغيّر لاحقاً، فلا يُعامل الملف الحالي كله بوصفه B الأصلي. الأيقونتان في `native-operation.tsx` إضافتان محليتان.
- هذا تدقيق مصدر وليس مقارنة screenshots جديدة أو نجاح استجابة للهاتف. الفروق أدناه مثبتة بالبنية وCSS؛ أثرها النهائي على المقاسات يحتاج عرضاً بعد الموافقة.

## جرد وخريطة D → B
المسارات التالية تحت `src/`. كلمة «تكييف» تعني تركيباً محدوداً فوق المصدر الأصلي، وليس تقليد شكله.

| العنصر | الحالي في D | مكوّن B الفعلي | الإجراء المقترح بعد الموافقة |
|---|---|---|---|
| Admin Shell | header/aside/main يدوياً في `talabot/native/index.tsx` | `app/[locale]/(admin)/layout.tsx` + `ui/sidebar.tsx`: SidebarProvider/SidebarInset | إعادة استخدام تركيب B مع جذر React الوحيد؛ فصل اعتماد Next/router فقط |
| Sidebar | أزرار نصية بعرض القائمة | `layout/app-layout/sidebar/index.tsx` + sidebar-header/nav-group/menu-item | استخدام مكوّن B وبيانات ملاحة واحدة لأقسام A الـ12؛ عدم إدخال صفحات القالب التجريبية |
| Header | شعار وselect لغة ومظهر في صف مستقل | `layout/app-layout/header/index.tsx` AppHeader | تكييف props/الملاحة؛ إبقاء الشعار واللغة والمظهر؛ عدم توصيل إجراءات تجريبية بإنتاج |
| Mobile Navigation | إظهار/إخفاء aside يدوياً | `ui/sidebar.tsx`, `ui/sheet.tsx`, `talabot/preview.tsx` MobileNavigation من مرجع B | استخدام سلوك B المتجاوب ومصدر ملاحة واحد؛ لا قائمتين داخل الصفحة |
| بطاقات A | native Card متكرر داخل grid | `main/dashboard/ecommerce/metrics/metric-card.tsx` MetricCard | تمرير حسابات A وتسمياتها كما هي؛ تبقى أعلى الصفحة؛ لا نسب اتجاه مختلقة |
| بطاقات B | أربع قيم في native Card بعد التحليلات | SummaryCards في نسخة B من `talabot/preview.tsx` | استخراج الجزء العرضي الأصلي من B وربطه بالتفاصيل المعتمدة؛ فصل بياناته عن A |
| البطاقات العامة | Card/Pair يدوية في `native/primitives.tsx` | `ui/card.tsx` Card/Header/Title/Content/Footer؛ `common/component-card.tsx` | إعادة استعمال Card؛ Pair تركيب حقول تفاصيل فوقه لا نظام بطاقات جديد |
| الأزرار | string `button` وHTML button | `ui/button.tsx` Button variants/sizes | استبدال الغلاف فقط، إبقاء callbacks والتأكيدات؛ مساحة لمس لا تقل عن الحالية |
| جداول الطلبات والأطراف | article وdiv وقوائم يدوية | `ui/table.tsx` Table/Header/Body/Row/Cell؛ Grid محلي في `talabot/workspace.tsx`؛ قائمة `talabot/orders.tsx` | استخدام primitives؛ استخراج نمط Grid عند الحاجة دون نسخ بيانات B أو تغيير حسابات A |
| Search | input search نصي | `ui/input-group.tsx` + `ui/input.tsx` + SearchIcon؛ مثال AppHeader | reuse مع state وquery والرجوع الحالي؛ البحث التشغيلي لا يُستبدل ببحث قالب تجريبي |
| Filters | details/select/date يدوية | `ui/popover.tsx`, `ui/select.tsx`, `ui/input.tsx`, `ui/button.tsx` + FilterIcon؛ نمط OrdersList | تركيب شريط فلاتر B مع فلاتر A؛ الثانوية مميّزة كمحاكاة |
| Forms | NativeForm يحوي state وmarkup | `ui/field.tsx` Field/FieldLabel/FieldError/FieldDescription | إبقاء controller/validation/drafts/mutation contracts؛ استبدال العرض فقط |
| Inputs | string `input` | `ui/input.tsx`, `ui/textarea.tsx`, `ui/checkbox.tsx`, `ui/file-input.tsx` | استخدام الأنواع الأصلية مع حدود ومدخلات A؛ رفع الصور يبقى فجوة وظيفية مستقلة |
| Selects | HTML select | `ui/select.tsx`, `ui/combobox.tsx` | إعادة استعمال بعد اختبار callback وقيمة فارغة وkeyboard؛ لا تعديل الخيارات |
| Dialogs | assignment-dialog / mutation-action / ticket-details تستورد B Dialog بالفعل | `ui/dialog.tsx` | حفظ الاستعمال الموجود؛ توحيد footer/actions عبر Button |
| تأكيد NativeForm | div role=alertdialog داخل النموذج | Dialog/Title/Description/Content | استبدال هذه البنية بـB Dialog مع حفظ المسودة والتأكيد ومنع التكرار |
| Status badges | span نصي في الطلبات | `talabot/integrated-review/order-status.tsx` OrderStatusBadge + `ui/badge.tsx` | الحفاظ على الحالة الدلالية؛ اختبار تغطية enum A قبل الربط؛ لا تحويل حالة مجهولة إلى أخرى |
| Tabs/status selection | صف أزرار حالات | `ui/tabs.tsx`, `ui/toggle-group.tsx` | ToggleGroup للفلاتر، Tabs فقط للمحتوى ذي الألواح؛ لا تغيير معنى الحالة |
| Notifications | OperationalAlerts جديدة؛ مركز B غير منقول | `layout/header/notification-dropdown/index.tsx`؛ NotificationsPage في `talabot/workspace.tsx`؛ notification-state.ts | توصيل عرض B إلى عينات معزولة؛ لا خلط تنبيه A برسالة B ذات طلب مختلف |
| Charts/analytics | استيراد AnalyticsDashboard الأصلي | `talabot/analytics.tsx`, analytics-data.ts | إبقاؤها كاملة دون إعادة كتابة؛ Card/DataTable/Plot داخل الملف محلية وليست exports عامة |
| Loading | p role=status | `ui/spinner.tsx`, `ui/skeleton.tsx` | إعادة استعمال primitives مع aria/status وإبقاء دورة التحميل |
| Empty | p نصي | Card + نمط empty الموجود في OrdersList/Grid | لا مكوّن EmptyState عام ضمن المكتبة المفحوصة؛ تركيب صغير من B |
| Error/denied | div/p role=alert | `ui/alert.tsx` + FieldError + Button | إبقاء الرسالة والسبب وretry والمرشحات؛ لا نجاح شكلي |
| تفاصيل Transcom | OrderDetails وPair يدوية | Card + Badge + Table + Tabs + Dialog + نمط تفاصيل Orders في B | تركيب مجال جديد من B؛ لا مكوّن جاهز يحفظ دورة A كاملة |
| اللغة والمظهر | ThemeProvider الأصلي، selectors يدوية | `layout/header/theme-toggler/index.tsx`؛ SettingsPage في workspace | استعمال واجهة B عبر bridge للملاحة المحلية؛ TG غير المكتمل يبقى موثقاً |

## الأيقونات
- موجودة في B: `CallIcon` اتصال، `PencilIcon` تعديل، `ChevronRightIcon` تفاصيل، `ChatIcon` محادثة، `SearchIcon` بحث، `FilterIcon` فلاتر، `MapIcon` خريطة تحتوي دبوساً.
- D تستخدم عدداً منها فعلاً، لكن Action يعرض نصاً دائماً بجانب الأيقونة، وحقول البحث/الفلاتر لا تستخدم الأيقونات باستمرار.
- LocationIcon وNativeWalletIcon رُسمتا محلياً. الأول قابل للاستبدال بـMapIcon الأصلي إذا اعتمد المالك دلالته المركبة؛ إذا كان المطلوب دبوساً منفرداً تحديداً، يلزم اشتقاق موثق. لم أجد Wallet مستقلاً في أسماء مكتبة B المفحوصة؛ لا يُستبدل بأيقونة مال مختلفة دلالياً بالافتراض.
- المقترح: Button الأصلي مع اسم وصول واضح للأفعال الواضحة؛ لا اعتماد على hover، مع بقاء الوصف والتأكيد للإجراءات الحساسة. لا تنفيذ الآن.

## الفروق المثبتة
1. D لا تستخدم AdminLayout/AppSidebar/AppHeader؛ layout منفصل يدوي رغم جذر React واحد.
2. `native-preview/main.tsx` يستورد globals.css فقط؛ لا يستورد `integrated-review/polish.css` ولا يركب حاوية `talabot-polish` الموجودة في B. هذا يفسر غياب جزء من تنسيق B، وليس مجرد اختلاف لون.
3. Card اليدوي rounded-2xl وp4/smp6 مقابل Card الأصلي rounded-xl وp5/smp6 وgap5؛ B نفسه يملك MetricCard بخصائص مختلفة، لذا يجب اختيار المكوّن حسب دوره لا فرض قياس واحد على الجميع.
4. أزرار D اليدوية لا تستفيد من variants/focus/disabled/invalid الأصلية في Button.
5. رأس الصفحة وselects اللغة والمظهر ومداخل القائمة مختلفة عن B؛ القوائم بلا منظومة أيقونات الملاحة الأصلية.
6. الطلبات تعرض article rows بدلاً من نظام الجداول/القائمة الخاص بـB، وحالات الطلب نصوص دون badges الأصلية.
7. معظم النماذج مبنية بعناصر HTML مباشرة؛ تأكيد NativeForm ليس Dialog B رغم استعماله في نوافذ أخرى.
8. بطاقات المؤشرات يدوية، ومؤشرات B أُعيد عرضها دون استعمال بطاقاتها وتفاعلاتها الأصلية.
9. ترجمة TG وتنسيق التواريخ وبعض التسميات لا تزال ناقصة؛ لم تُحسم ضمن مراجعة الشكل.

## خطة التوحيد المحدودة — تنتظر موافقة المالك
1. تثبيت نقطة المصدر الحالية والأدلة؛ لا تغيير domain/navigation/mutation-service/fixtures أو حسابات المؤشرات.
2. ربط Shell/Header/Sidebar من B بواجهات props محلية للملاحة. لا إضافة Next root ثانٍ أو إعادة تحميل تطبيق آخر. الاحتفاظ بمصدر B المرجعي منفصلاً.
3. استبدال primitives اليدوية بـCard/Button/Field/Input/Select/Badge من B، تدريجياً وبنفس callbacks وdraft keys والقيم. استكمال Dialog التأكيد.
4. نقل عرض القوائم والفلاتر والمؤشرات إلى مكونات B المناسبة. A أعلى الصفحة؛ B ضمن التحليلات؛ لا روابط أقسام مكررة داخل الرئيسية.
5. توصيل الإشعارات/حالات التحميل والخطأ، وتركيب تفاصيل Transcom من primitives B؛ لا نقل قواعد مالية أو صلاحيات من بيانات العرض.
6. بعد كل مجموعة: مقارنة المدخلات والنتائج والأخطاء والتأكيدات والرجوع، واختبارات أثر التغيير فقط، وCommit بعيد. عند اكتمال المجموعة: 320/390/1440، EN/RU/TG، Light/Dark/Auto، focus/keyboard/touch. Safari الفعلي يبقى NOT TESTED حتى تنفيذه.

## ما يحتاج اشتقاقاً فعلاً
- Router bridge لأن Shell وWorkspace في B يعتمدان Next/i18n navigation بينما D هي SPA مستقلة؛ لا حاجة لقالب جديد.
- تركيب تفاصيل العملية/الأطراف/المالية/Timeline/المحادثة بعقود A باستخدام B. لا يوجد مكوّن واحد جاهز يحقق ذلك.
- Empty/error/permission blocks موحدة من Card/Alert/Spinner؛ ليست نظام تصميم جديداً.
- فصل مكونات محلية غير مصدّرة مثل Grid وSummaryCards إلى أجزاء عرضية عند الحاجة، مع حفظ تفاعلاتها.
- Icon wallet منفرد، وربما pin منفرد، فقط بعد اختيار المالك؛ لا تعديل مكتبة الأيقونات الآن.

## الحماية والقبول
لم يتغير كود التطبيق أو الشكل أو A/B/C/D2 أو الإنتاج، ولم يُنشر أو يُدمج شيء. لا إعادة لاختبارات البناء والتفاعل لأن هذه الدفعة توثيق فقط. نتائج الدفعة السابقة لا تصبح قبولاً بصرياً: Build/TS ناجحان، 17 فحصاً جديداً، Lint 0 أخطاء/49 تحذيراً؛ الاختبارات غير المنفذة تبقى غير منفذة.

القرار المطلوب: اعتماد خريطة إعادة الاستخدام والخطة المحدودة أعلاه قبل استبدال أي مكون. الاختيار الوحيد الإضافي: MapIcon الأصلي (خريطة مع دبوس) أم اشتقاق دبوس منفرد، مع اشتقاق محفظة متوافق عند الحاجة. لا إعادة فتح الألوان أو المؤشرات أو الصلاحيات أو القرارات السابقة.
