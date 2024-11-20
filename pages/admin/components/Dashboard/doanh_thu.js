import { useEffect, useState } from "react";
import { db } from "@/feature/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const RevenueSummary = () => {
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const ordersCollection = collection(db, "previous-order");
        const orderDocs = await getDocs(ordersCollection);
        const items = orderDocs.docs.map((doc) => doc.data().items).flat();

        let totalYearly = 0;
        let totalMonthly = 0;
        let totalDaily = 0;

        const today = new Date();
        const currentDay = today.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const currentMonth = today.toLocaleString('en-GB', { month: '2-digit', year: 'numeric' });
        const currentYear = today.getFullYear();

        items.forEach((item) => {
          const date = new Date(item.date);
          const total = parseFloat(item.total);

          if (date.getFullYear() === currentYear) {
            totalYearly += total;
            if (date.toLocaleString('en-GB', { month: '2-digit', year: 'numeric' }) === currentMonth) {
              totalMonthly += total;
              if (date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) === currentDay) {
                totalDaily += total;
              }
            }
          }
        });

        setYearlyRevenue(totalYearly);
        setMonthlyRevenue(totalMonthly);
        setDailyRevenue(totalDaily);
      } catch (error) {
        console.error("Error fetching revenue data from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-medium">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
            
    <div className="max-w-md mx-auto bg-white border border-black rounded-lg shadow-lg p-6 space-y-4">
      <div className="space-y-3">
      <h2 className="text-2xl font-bold mb-4 text-center">Doanh Thu</h2>
        <div className="bg-blue-100 p-4 rounded-lg shadow">
   
        <p className="text-lg font-semibold text-blue-700">Doanh thu hôm nay</p>
 
          <p className="text-2xl font-bold text-blue-900">{dailyRevenue.toLocaleString()} VND</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <p className="text-lg font-semibold text-green-700">Doanh thu tháng này</p>
          <p className="text-2xl font-bold text-green-900">{monthlyRevenue.toLocaleString()} VND</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <p className="text-lg font-semibold text-yellow-700">Doanh thu năm nay</p>
          <p className="text-2xl font-bold text-yellow-900">{yearlyRevenue.toLocaleString()} VND</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RevenueSummary;
