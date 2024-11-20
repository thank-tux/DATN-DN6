// ProductChart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { db } from '@/feature/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);

      const categoryCounts = {};

      productsSnapshot.forEach(doc => {
        const product = doc.data();
        if (Array.isArray(product.categories)) {
          product.categories.forEach(category => {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
        }
      });

      const labels = Object.keys(categoryCounts);
      const data = Object.values(categoryCounts);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Số lượng sản phẩm theo thể loại',
            data: data,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
            ],
            hoverOffset: 4,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-full h-97 m-auto bg-white shadow-lg rounded-lg p-6 border border-black">
      <h2 className="text-[20px] font-bold p-2 uppercase mb-4 tracking-wide">
        Số lượng sản phẩm theo thể loại
      </h2>
      <div className="h-[300px]"> {/* Điều chỉnh chiều cao biểu đồ */}
        <Pie 
          options={{
            maintainAspectRatio: false,
            responsive: true, // Bật chế độ đáp ứng
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                padding: 10, // Thêm padding cho tooltip
              },
            },
          }}
          data={chartData}
        />
      </div>
    </div>
  );
};

export default ProductChart;
