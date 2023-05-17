import { AiFillLock } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import Loader from "@/components/loader";
import { formatMoney } from "@/utils";
import TextInput from "@/components/text-input";
import { getPosition } from "@/feature/get-location";

export default function Checkout() {
  const { userInfo } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function fectchData() {
      const res = await axios.post("/api/item", {
        name: "cart",
        id: userInfo.uid,
      });
      const data = await res.data;
      var value = null;
      data.arrayCart.forEach((element) => {
        value += element.quantity * element.price;
      });
      setTotal(value);
      setData(data);
      setLoading(false);
    }
    if (userInfo) {
      fectchData();
    }
  }, [userInfo]);

  const handleGetLocation = async () => {
    const { result, error } = await getPosition();
    // console.log(result);
    if (!error) {
      setLocation(result);
    }
  };
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
            <h2 className="oswald uppercase text-xl :">Được giao đến:</h2>
            <button
              onClick={handleGetLocation}
              className="px-4 mt-2 btn-shadow py-2 text-white font-bold uppercase text-[15px] rounded-full block bg-red-600"
            >
              Địa chỉ hiện tại
            </button>
            <TextInput />
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
        <div className="sticky box-shadow p-4 rounded-xl top-[200px]">
          <h2 className="oswald uppercase text-xl :">Tóm tắt đơn hàng:</h2>
          <ul className="my-2">
            {data.arrayCart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between capitalize roboto"
              >
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
          <hr />
          <h2 className="oswald uppercase text-lg text-[14px]">Thanh toán:</h2>
          <div className="my-2 flex justify-between">
            <span>Tổng đơn hàng:</span>
            <span>{formatMoney(total)}₫</span>
          </div>
          <div className="my-2 flex justify-between">
            <span>Phí giao hàng:</span>
            <span>{formatMoney(10000)}₫</span>
          </div>
          <hr />
          <div className="my-2 flex justify-between oswald">
            <span>Tổng thanh toán:</span>
            <span>{formatMoney(total + 10000)}₫</span>
          </div>
        </div>
      </div>
    </div>
  );
}
