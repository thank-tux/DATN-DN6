import { AiFillLock } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import Loader from "@/components/loader";
import { formatMoney } from "@/utils";
import TextInput from "@/components/text-input";
import { getPosition } from "@/feature/get-location";
import { MdOutlinePayments, MdPayment } from "react-icons/md";

export default function Checkout() {
  const { userInfo } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [home, setHome] = useState("");
  const [wards, setWards] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [rule, setRule] = useState(false);
  const [bank, setBank] = useState(true);

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
    await getPosition((value) => {
      const { result, error } = value;
      if (!error) {
        console.log(result);
        setCity(result.city);
        setDistrict(result.locality);
      }
    });
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
            <TextInput
              value={home}
              callback={(text) => setHome(text)}
              name="Số nhà"
            />
            <TextInput
              value={wards}
              callback={(text) => setWards(text)}
              name="Phường/Xã"
            />
            <TextInput
              value={district}
              callback={(text) => setDistrict(text)}
              name="Quận"
            />
            <TextInput
              value={city}
              callback={(text) => setCity(text)}
              name="Thành phố"
            />
          </div>
          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl :">
              Thêm thông tin chi tiết:
            </h2>
            <TextInput
              value={name}
              callback={(text) => setName(text)}
              name="Họ tên của bạn"
            />
            <TextInput
              value={phone}
              callback={(text) => setPhone(text)}
              name="Số điện thoại"
              type="number"
            />
            <TextInput
              value={email}
              callback={(text) => setEmail(text)}
              name="Địa chỉ email"
            />
          </div>
          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl :">
              phương thức thanh toán:
            </h2>
            <div
              onClick={() => setBank(true)}
              className={`${
                bank
                  ? "border-black bg-black text-white"
                  : "text-black border-black"
              } cursor-pointer font-bold flex items-center justify-between my-2 border-2 px-2 py-4 rounded-[6px]`}
            >
              <span>Thanh toán khi nhận hàng</span>
              <MdOutlinePayments className="w-7 h-7" />
            </div>
            <div
              onClick={() => setBank(false)}
              className={`${
                bank
                  ? "text-black border-black"
                  : "border-black bg-black text-white"
              } cursor-pointer font-bold flex items-center justify-between my-2  border-2 px-2 py-4 rounded-[6px]`}
            >
              Thanh toán visa
              <MdPayment className="w-7 h-7" />
            </div>
          </div>
          <div>
            <input
              value={rule}
              onChange={() => {
                setRule(true);
              }}
              type="checkbox"
            />
            <span>Tôi đã đọc và đồng ý với các</span>
            <span className="font-bold underline ml-1">
              Chính Sách Hoạt Động của KFC Việt Nam
            </span>
          </div>
          <div className="text-center btn-shadow py-4 rounded-full bg-[#28a745] font-bold text-white my-10">
            Đặt hàng
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
