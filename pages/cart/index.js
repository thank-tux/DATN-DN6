import { useState, useEffect, useContext } from "react";
import AuthContext from "@/feature/auth-context";
import { getItem } from "@/feature/firebase/firebaseAuth";
import Loader from "@/components/loader";
import CardCart from "@/components/card-cart";
import EmptyCart from "@/components/empty-cart";

export default function Cart() {
  const { userInfo } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fecthData = async () => {
    let value = 0;
    const data = await getItem("cart", userInfo.uid);
    data.arrayCart.forEach((element) => {
      value += element.quantity * element.price;
    });
    setTotal(value);
    setCart(data.arrayCart);
    setLoading(true);
  };
  useEffect(() => {
    if (userInfo) {
      fecthData();
    }
  }, [userInfo]);
  if (!loading) {
    return <Loader />;
  }
  return (
    <div className="container m-auto ">
      <div className=" before:left-[17px] page-with-bar">
        <h2 className="oswald text-4xl py-4  block">Giỏ hàng của tôi</h2>
      </div>
      <div className="flex justify-between">
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="w-[60%]">
              {cart.map((item) => {
                return <CardCart {...item} />;
              })}
            </div>
            <div className="w-[38%]">
              <div className="sticky top-[150px] my-4 box-shadow p-6 rounded-xl ">
                <h2 className="oswald text-3xl uppercase border-b pb-4 border-[#ccc]">
                  {cart.length} món
                </h2>
                <div className="my-2 flex justify-between">
                  <span>Tổng đơn hàng</span>
                  <span>{}</span>
                </div>
                <div className="my-2 flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>10000₫</span>
                </div>
                <div className="my-2 font-bold flex justify-between border-b border-[#ccc] pb-4">
                  <span>Tổng thanh toán</span>
                  <span>{total + 10000}₫</span>
                </div>
                <div className="flex p-4 font-bold mt-6 btn-shadow cursor-pointer bg-red-500 text-white rounded-full justify-between">
                  <span>Thanh toán</span>
                  <span>{total + 10000}₫</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
