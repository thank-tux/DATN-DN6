import { useEffect, useState } from "react";
import { db } from "@/feature/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from 'next/link';


const OrderCountDisplay = () => {
  const [ordersData, setOrdersData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersCollection = collection(db, "previous-order");
        const orderDocs = await getDocs(ordersCollection);
        const items = orderDocs.docs.map((doc) => doc.data().items).flat();

        const today = new Date();
        const year = today.getFullYear();
        const month = today.toLocaleString("en-GB", { month: "2-digit" });
        const day = today.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        // Tính ngày đầu tuần và ngày cuối tuần hiện tại
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        let dailyCount = 0;
        let weeklyCount = 0;
        let monthlyCount = 0;

        items.forEach((item) => {
          const dateString = item.date; // Giả sử date nằm trong item
          const date = new Date(dateString);
          const itemYear = date.getFullYear();
          const itemMonth = date.toLocaleString("en-GB", { month: "2-digit" });
          const itemDay = date.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          // Đếm số đơn hàng theo ngày
          if (itemYear === year && itemMonth === month && itemDay === day) {
            dailyCount++;
          }

          // Đếm số đơn hàng theo tuần
          if (date >= startOfWeek && date <= endOfWeek) {
            weeklyCount++;
          }

          // Đếm số đơn hàng theo tháng
          if (itemYear === year && itemMonth === month) {
            monthlyCount++;
          }
        });

        setOrdersData({
          daily: dailyCount,
          weekly: weeklyCount,
          monthly: monthlyCount,
        });
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-black">
      <h2 className="text-2xl font-bold mb-4 text-center">Số Đơn Hàng</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg text-center shadow border border-black">
          <h3 className="text-lg font-semibold">Hôm nay:</h3>
          <p className="text-2xl font-bold text-blue-600">{ordersData.daily} đơn hàng</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center shadow border border-black">
          <h3 className="text-lg font-semibold">Tuần này:</h3>
          <p className="text-2xl font-bold text-purple-600">{ordersData.weekly} đơn hàng</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow border border-black">
          <h3 className="text-lg font-semibold">Tháng này:</h3>
          <p className="text-2xl font-bold text-green-600">{ordersData.monthly} đơn hàng</p>
        </div>
      </div>
      <div className="flex flex-col items-center mt-6 gap-4">
        <Link href="/admin/orders" passHref>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow w-[250px]">
            Xem Chi Tiết Đơn Hàng
          </button>
        </Link>
        <Link href="/admin/statistics" passHref>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow w-[250px]">
            Xem Thống Kê Đơn Hàng
          </button>
        </Link>
      </div>


    </div>

  );
};

export default OrderCountDisplay;
