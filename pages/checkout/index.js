import { AiFillLock } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import Loader from "@/components/loader";

export default function Checkout() {
  const { userInfo } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fectchData() {
      const res = await axios.post("/api/item", {
        name: "cart",
        id: userInfo.uid,
      });
      const data = await res.data;
      setData(data);
      setLoading(false);
    }
    fectchData();
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen container m-auto flex">
      <div className="flex-60">
        <div className="w-[80%] m-auto mt-10">
          <h2 className="text-4xl oswald flex items-center justify-center">
            <AiFillLock /> <span>Thông tin đặt hàng</span>
          </h2>
          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl :">Thời gian giao hàng:</h2>
            <span>Giao ngay</span>
          </div>
          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl :">Được giao từ:</h2>
          </div>
          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl :">
              Thêm thông tin chi tiết:
            </h2>
          </div>
          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl :">
              phương thức thanh toán:
            </h2>
          </div>
        </div>
      </div>
      <div className="flex-40 p-2">
        <div className="sticky box-shadow p-4 top-[200px]">
          <h2 className="oswald uppercase text-xl :">Tóm tắt đơn hàng:</h2>
          <ul></ul>
          <hr />
          <h2 className="roboto text-lg text-[14px]">Tóm tắt đơn hàng:</h2>
        </div>
      </div>
    </div>
  );
}
