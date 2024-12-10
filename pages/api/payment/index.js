import {
  addDataWithID,
  addToFirebaseArray,
  getItem,
  deleData,
} from "@/feature/firebase/firebaseAuth";
import crypto from "crypto";

const config = {
  vnp_TmnCode: "ZKO72IDD",
  vnp_HashSecret: "R8KYWZS2Q45IZIDAA3Y5UDZRWIV6O5F3",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl: "http://localhost:3000/",
};

export default async function handle(req, res) {
  const { method } = req;
  if (method === "POST") {
    try {
      const {
        id_user,
        list_item,
        date,
        total,
        address,
        payment,
        customer_info,
      } = req.body;

      // Tạo URL thanh toán VNPay
      const vnpUrl = createVNPayUrl({
        amount: total,
        orderInfo: "Thanh toán đơn hàng",
        ipAddress: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      });

      // Lưu đơn hàng vào Firebase trước khi thanh toán
      const check = await getItem("previous-order", id_user);
      const orderData = {
        list_item,
        date,
        total,
        address,
        payment: "VNPay",
        customer_info,
      };

      if (check) {
        await addToFirebaseArray("previous-order", id_user, orderData);
      } else {
        await addDataWithID("previous-order", id_user, { items: [orderData] });
      }

      await deleData("cart", id_user);

      res.status(200).json({ result: true, paymentUrl: vnpUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: error.message });
    }
  }
}

// Tạo URL thanh toán VNPay
function createVNPayUrl({ amount, orderInfo, ipAddress }) {
  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.vnp_TmnCode,
    vnp_Amount: amount * 100, 
    vnp_CurrCode: "VND",
    vnp_TxnRef: generateTxnRef(),
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "billpayment",
    vnp_Locale: "vn",
    vnp_ReturnUrl: config.vnp_ReturnUrl,
    vnp_IpAddr: ipAddress,
    vnp_CreateDate: getCurrentDate(),
  };

  const sortedParams = sortObject(vnp_Params);
  const queryString = new URLSearchParams(sortedParams).toString();
  const hash = crypto
    .createHmac("sha512", config.vnp_HashSecret)
    .update(queryString)
    .digest("hex");

  return `${config.vnp_Url}?${queryString}&vnp_SecureHash=${hash}`;
}

// Hàm tạo mã giao dịch
function generateTxnRef() {
  return Date.now().toString();
}

// Hàm lấy ngày giờ hiện tại
function getCurrentDate() {
  const date = new Date();
  return date
    .toISOString()
    .replace(/T/, "")
    .replace(/-/g, "")
    .slice(0, 14);
}

// Sắp xếp tham số theo thứ tự a-z
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}
