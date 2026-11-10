import AnalyticsDashboard from "@/components/talabot/analytics";
import { SummaryCards, NeedsAttention } from "@/components/talabot/preview";
import OperationsFrame, { OperationsLinks, ReviewNotice, AnalyticsHeading } from "@/components/talabot/unified-review";
export const metadata = { title:"TALABOT — UX-02 D isolated review" };
export default function Home(){return <div className="grid grid-cols-12 gap-4 md:gap-6"><div className="col-span-12"><ReviewNotice/></div><div className="col-span-12"><OperationsFrame/></div><div className="col-span-12"><OperationsLinks/></div><div className="col-span-12"><AnalyticsHeading/></div><AnalyticsDashboard/><div className="col-span-12"><AnalyticsHeading sample/></div><div className="col-span-12"><SummaryCards/></div><div className="col-span-12"><NeedsAttention/></div></div>}
