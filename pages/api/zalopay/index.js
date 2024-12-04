// pages/api/create-payment.js
import axios from "axios";
import moment from "moment";
import CryptoJS from "crypto-js";

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { value = 50000 } = req.body; // Giá trị thanh toán từ frontend
  const transID = Math.floor(Math.random() * 1000000);

  const embed_data = { redirecturl: "localhost:3000" };
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify([]),
    embed_data: JSON.stringify(embed_data),
    amount: value,
    callback_url: "https://b074-1-53-37-194.ngrok-free.app/callback",
    description: `Payment for the order #${transID}`,
    bank_code: "",
  };

  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;

  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString(CryptoJS.enc.Hex);

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    res.status(200).json(result.data); // Trả về dữ liệu từ API ZaloPay
  } catch (error) {
    console.error("ZaloPay API Error:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
}
