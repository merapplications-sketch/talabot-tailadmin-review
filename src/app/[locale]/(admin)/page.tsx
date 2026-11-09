import DemographicCard from "@/components/main/dashboard/ecommerce/demographic-card";
import {
  PreviewNotice,
  SummaryCards,
  NeedsAttention,
} from "@/components/talabot/preview";
import MonthlySalesChart from "@/components/main/dashboard/ecommerce/monthly-sales-chart";
import MonthlyTarget from "@/components/main/dashboard/ecommerce/monthly-target";
import RecentOrders from "@/components/main/dashboard/ecommerce/recent-orders";
import StatisticsChart from "@/components/main/dashboard/ecommerce/statistics-chart";
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
      <div className="col-span-12 xl:col-span-7">
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
