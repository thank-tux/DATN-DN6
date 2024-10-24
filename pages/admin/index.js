import React from "react";

// components

import CardLineChart from "../admin/components/Cards/CardLineChart";
import CardBarChart from "../admin/components/Cards/CardBarChart.js";
import CardPageVisits from "../admin/components/Cards/CardPageVisits.js";
import CardSocialTraffic from "../admin/components/Cards/CardSocialTraffic.js";

// layout for page

import Admin from "../admin/layouts/Admin";

export default function Dashboard() {
  return (
  
    <>
     <div className="relative container mx-auto p-4 mb-6 top-[120px]">
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardLineChart />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart />
        </div>
      </div>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardPageVisits />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div>
      </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
