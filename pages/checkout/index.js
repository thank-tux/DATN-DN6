import { AiFillLock } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import Loader from "@/components/loader";
import { formatMoney } from "@/utils";
import TextInput from "@/components/text-input";
import { getPosition } from "@/feature/get-location";
import { MdOutlinePayments, MdPayment } from "react-icons/md";
import { getDate } from "@/utils";
import Modal from "@/components/modal";
import Delivery from "@/components/delivery";
import EmptyCart from "@/components/empty-cart";
import { validateOrder } from "@/feature/validation/valiorders";

export default function Checkout() {
  const { userInfo, emptyCart } = useContext(AuthContext);
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
  const [errorOrder, setValidationErrors] = useState(null);
  const [bank, setBank] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handelPayment = async () => {
    const orderData = {
      name,
      phone,
      email,
      home,
      wards,
      district,
      city,
      rule,
    };

    const validationErrors = validateOrder(orderData);
    setValidationErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const result = {
      id_user: userInfo.uid,
      list_item: data.arrayCart,
      date: getDate(),
      total: total + 10000,
      address: {
        home,
        wards,
        district,
        city,
      },
      payment: bank ? "delivery" : "VNPay",
      customer_info: {
        name,
        phone,
      },
    };

    try {
      const res = await axios.post("/api/payment", result);
      const newData = await res.data;

      if (newData.result) {
        if (bank === false && newData.paymentUrl) {
          window.location.href = newData.paymentUrl; // Chuyển đến VNPay
        } else {
          emptyCart();
          setShowModal(true); // Hiển thị thông báo đặt hàng thành công
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await axios.post("/api/item", {
        name: "cart",
        id: userInfo.uid,
      });
      const data = await res.data;
      let value = 0;

      if (data) {
        data.arrayCart.forEach((element) => {
          value += element.quantity * element.price;
        });
        setTotal(value);
        setData(data);
      }
      setLoading(false);
    }

    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  const handleGetLocation = async () => {
    await getPosition((value) => {
      const { result, error } = value;
      if (!error) {
        setCity(result.city);
        setDistrict(result.locality);
      }
    });
  };

  if (loading) return <Loader />;
  if (!data) return <EmptyCart />;

  return (
    <div className="min-h-screen relative container m-auto flex">
      <div className="flex-60">
        <div className="w-[80%] m-auto mt-10">
          <h2 className="text-4xl oswald flex items-center justify-center">
            <AiFillLock /> <span>Thông tin đặt hàng</span>
          </h2>

          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl">Được giao đến:</h2>
            <button
              onClick={handleGetLocation}
              className="px-4 mt-2 btn-shadow py-2 text-white font-bold uppercase text-[15px] rounded-full block bg-red-600"
            >
              Địa chỉ hiện tại
            </button>
            <TextInput
              value={home}
              callback={setHome}
              name="Số nhà"
              error={errorOrder?.home}
            />
            <TextInput
              value={wards}
              callback={setWards}
              name="Phường/Xã"
              error={errorOrder?.wards}
            />
            <TextInput
              value={district}
              callback={setDistrict}
              name="Quận"
              error={errorOrder?.district}
            />
            <TextInput
              value={city}
              callback={setCity}
              name="Thành phố"
              error={errorOrder?.city}
            />
          </div>

          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl">Thông tin khách hàng:</h2>
            <TextInput
              value={name}
              callback={setName}
              name="Họ tên của bạn"
              error={errorOrder?.name}
            />
            <TextInput
              value={phone}
              callback={setPhone}
              name="Số điện thoại"
              type="number"
              error={errorOrder?.phone}
            />
            <TextInput
              value={email}
              callback={setEmail}
              name="Địa chỉ email"
              error={errorOrder?.email}
            />
          </div>

          <div className="bg-[#f8f7f5] my-2 p-4">
            <h2 className="oswald uppercase text-xl">Phương thức thanh toán:</h2>
            <div
              onClick={() => setBank(true)}
              className={`${
                bank ? "bg-black text-white" : "text-black"
              } cursor-pointer flex items-center justify-between border-2 px-2 py-4 rounded-[6px]`}
            >
              Thanh toán khi nhận hàng
              <MdOutlinePayments className="w-7 h-7" />
            </div>
            <div
              onClick={() => setBank(false)}
              className={`${
                !bank ? "bg-black text-white" : "text-black"
              } cursor-pointer flex items-center justify-between border-2 px-2 py-4 rounded-[6px]`}
            >
              Thanh toán VNPay
              <MdPayment className="w-7 h-7" />
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              checked={rule}
              onChange={() => setRule(!rule)}
            />
            <span>
              Tôi đã đọc và đồng ý với các{" "}
              <span className="font-bold underline ml-1">
                Chính sách hoạt động
              </span>
            </span>
          </div>

          <div
            onClick={handelPayment}
            className="text-center cursor-pointer btn-shadow py-4 rounded-full bg-[#28a745] font-bold text-white my-10"
          >
            Đặt hàng
          </div>
        </div>
      </div>

      <div className="flex-40 p-2">
        <div className="sticky box-shadow p-4 rounded-xl top-[200px]">
          <h2 className="oswald uppercase text-xl">Tóm tắt đơn hàng:</h2>
          <ul className="my-2">
            {data.arrayCart.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="my-2 flex justify-between">
            <span>Tổng thanh toán:</span>
            <span>{formatMoney(total + 10000)}₫</span>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal show={showModal}>
          <Delivery />
        </Modal>
      )}
    </div>
  );
}
