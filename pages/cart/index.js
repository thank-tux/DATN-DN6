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

  const fecthData = async () => {
    const data = await getItem("cart", userInfo.uid);
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
      <div className="flex">
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="w-[60%]">
              {cart.map((item) => {
                return <CardCart {...item} />;
              })}
            </div>
            <div className="38%"></div>
          </>
        )}
      </div>
    </div>
  );
}
