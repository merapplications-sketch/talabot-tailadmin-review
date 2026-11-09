import AnalyticsDashboard from "@/components/talabot/analytics";
import {
  PreviewNotice,
  SummaryCards,
  NeedsAttention,
} from "@/components/talabot/preview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TALABOT — Admin Preview",
  description: "TALABOT independent design preview with synthetic data",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <PreviewNotice />
      </div>
      <div className="col-span-12">
        <SummaryCards />
      </div>
      <div className="col-span-12">
        <NeedsAttention />
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
