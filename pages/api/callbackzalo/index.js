// pages/api/callback.js
import CryptoJS from "crypto-js";

const config = {
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
};

export default function handler(req, res) {
  if (req.method === "POST") {
    let result = {};
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        let dataJson = JSON.parse(dataStr);
        console.log(
          "Update order's status = success where app_trans_id =",
          dataJson["app_trans_id"]
        );
        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      console.log("Error: " + ex.message);
      result.return_code = 0;
      result.return_message = ex.message;
    }

    res.json(result);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
