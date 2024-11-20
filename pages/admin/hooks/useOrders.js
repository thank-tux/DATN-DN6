// hooks/useOrders.js
import { useEffect, useState } from 'react';
import { db } from '@/feature/firebase/firebase'; // Đường dẫn đến cấu hình Firebase của bạn
import { collection, getDocs } from 'firebase/firestore';

const useOrders = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      const ordersCollection = collection(db, 'previous-order');
      const ordersSnapshot = await getDocs(ordersCollection);
      
      let total = 0;
      ordersSnapshot.forEach(doc => {
        const items = doc.data().items || []; // Lấy dữ liệu từ trường items
        items.forEach(item => {
          const totalValue = parseFloat(item.total); // Chuyển đổi thành số
          if (!isNaN(totalValue)) {
            total += totalValue; // Thêm vào tổng nếu không phải NaN
          }
        });
      });
      
      setTotalRevenue(total); // Cập nhật doanh thu tổng
    };

    fetchTotalRevenue();
  }, []);

  return totalRevenue;
};

export default useOrders;
