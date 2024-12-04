import GooglePayButton from "@google-pay/button-react";

import { useEffect, useState } from "react";
import axios from "axios";

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

export default function Payment({ value = 50000 }) {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createPayment = async () => {
      try {
        const response = await axios.post("/api/zalopay", {
          value: 50000, // Giá trị thanh toán
        });
        setPaymentUrl(response.data.order_url); // Lấy order_url từ API
        setLoading(false);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        setLoading(false);
      }
    };

    createPayment(); // Gọi API khi component mount
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {" "}
      {loading ? (
        <p> Loading payment URL... </p>
      ) : paymentUrl ? (
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Go to Payment{" "}
        </a>
      ) : (
        <p> Failed to create payment.Please try again. </p>
      )}{" "}
    </div>
  );
}
