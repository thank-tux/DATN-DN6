import React from "react";

export default function Payment({ value = 0, callback }) {
  const handleVNPayPayment = async () => {
    try {
      await callback(); // Gọi hàm thanh toán từ checkout
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán VNPay:", error);
    }
  };

  return (
    <button
      className="my-2 w-full px-4 py-2 bg-blue-600 text-white font-bold uppercase rounded-lg"
      onClick={handleVNPayPayment}
    >
      Thanh toán VNPay ({value.toLocaleString("vi-VN")}₫)
    </button>
  );
}
