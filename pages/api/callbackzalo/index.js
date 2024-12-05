import CryptoJS from "crypto-js";

const config = {
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    // Chỉ cho phép phương thức POST
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let result = {};

  try {
    const { data: dataStr, mac: reqMac } = req.body; // Lấy data và mac từ request body

    // Tạo MAC từ dataStr
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString(
      CryptoJS.enc.Hex
    );
    console.log("Generated MAC =", mac);

    // Kiểm tra MAC có hợp lệ không
    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Nếu MAC hợp lệ, xử lý dữ liệu thanh toán thành công
      const dataJson = JSON.parse(dataStr); // Parse JSON từ data
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (error) {
    console.error("Callback Error:", error);
    result.return_code = 0; // ZaloPay server sẽ callback lại tối đa 3 lần
    result.return_message = error.message;
  }

  // Trả về kết quả cho ZaloPay
  res.json(result);
}
