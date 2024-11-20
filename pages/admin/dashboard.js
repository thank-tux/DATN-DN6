// Dashboard.js
import React from "react";
import useOrders from "./hooks/useOrders";

// components
import CardLineChart from "./components/Cards/CardLineChart";
import ProductChart from "./components/Cards/ProductsChart";
import Admin from "./layouts/Admin";
import RevenueSummary from "./components/Dashboard/doanh_thu";
import OrderCountDisplay from "./components/Dashboard/don_hang";

export default function Dashboard() {
  const totalRevenue = useOrders();

  return (
    <>
      <div className="relative container mx-auto p-4 mb-6 top-[120px]">
        <h2 className="text-2xl font-bold mb-5">TỔNG QUAN</h2>
        <div className="flex flex-wrap mt-10 mr-20">
          <div className="w-full xl:w-6/12 mb-12 px-4">
            <RevenueSummary />
          </div>
          <div className="w-full xl:w-6/12 mb-12 px-4">
            <OrderCountDisplay />
          </div>
        </div>
        <div className="flex flex-wrap mt-4">
          <div className="w-full px-4">
            <ProductChart />
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
