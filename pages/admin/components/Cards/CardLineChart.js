import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { db } from "@/feature/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Chart from 'chart.js/auto';

const CardLineChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersCollection = collection(db, "previous-order");
        const orderDocs = await getDocs(ordersCollection);
        const items = orderDocs.docs.map((doc) => doc.data().items).flat();

        const monthlyRevenue = {};
        const dailyRevenue = {};

        items.forEach((item) => {
          const date = new Date(item.date);
          const total = parseFloat(item.total);
          const month = date.toLocaleString('en-GB', { month: '2-digit', year: 'numeric' });
          const day = date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });

          if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = 0;
            dailyRevenue[month] = {};
          }
          monthlyRevenue[month] += total;

          if (!dailyRevenue[month][day]) {
            dailyRevenue[month][day] = 0;
          }
          dailyRevenue[month][day] += total;
        });

        const sortedMonthlyData = Object.entries(monthlyRevenue)
          .sort(([a], [b]) => new Date(`01/${a}`) - new Date(`01/${b}`));

        setMonthlyData(sortedMonthlyData);
        setDailyData(dailyRevenue);

        setChartData({
          labels: sortedMonthlyData.map(([key]) => key),
          datasets: [
            {
              label: "Doanh thu theo tháng",
              data: sortedMonthlyData.map(([, value]) => value),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              barThickness: 30,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setSelectedDay(""); // Reset selected day when month changes

    if (month && dailyData[month]) {
      const dailyLabels = Object.keys(dailyData[month]);
      const dailyValues = Object.values(dailyData[month]);

      setChartData({
        labels: dailyLabels,
        datasets: [
          {
            label: `Doanh thu theo ngày - Tháng ${month}`,
            data: dailyValues,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            barThickness: 20,
          },
        ],
      });
    }
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);

    if (selectedMonth && day && dailyData[selectedMonth][day]) {
      setChartData({
        labels: [day],
        datasets: [
          {
            label: `Doanh thu ngày ${day}`,
            data: [dailyData[selectedMonth][day]],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            barThickness: 30,
          },
        ],
      });
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <h2>Doanh thu</h2>
      <div>
        <label htmlFor="monthSelect">Chọn tháng:</label>
        <select id="monthSelect" onChange={(e) => handleMonthChange(e.target.value)} value={selectedMonth}>
          <option value="">Chọn tháng</option>
          {monthlyData.map(([month]) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {selectedMonth && (
        <div>
          <label htmlFor="daySelect">Chọn ngày:</label>
          <select id="daySelect" onChange={(e) => handleDayChange(e.target.value)} value={selectedDay}>
            <option value="">Chọn ngày</option>
            {Object.keys(dailyData[selectedMonth]).map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      )}

      <Bar data={chartData} />
    </div>
  );
};

export default CardLineChart;
