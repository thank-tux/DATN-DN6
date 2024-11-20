// Dashboard.js
import React from "react";
import useOrders from "../../hooks/useOrders"; // Đường dẫn đến hook của bạn

// components
import CardLineChart from "../../components/Cards/CardLineChart";
import Admin from "../../layouts/Admin";
export default function Dashboard() {
  const totalRevenue = useOrders(); // Lấy doanh thu từ hook

  return (
    <>
      <div className="relative container mx-auto p-4 mb-6 top-[120px]">
        <div className="flex flex-wrap">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <CardLineChart/>
          </div>
          <div className="w-full xl:w-4/12 px-4">
      
          </div>
        </div>
        <div className="flex flex-wrap mt-4">

        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;