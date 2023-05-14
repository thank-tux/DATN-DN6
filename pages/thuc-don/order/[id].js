import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "@/components/loader";
import Image from "next/image";
import Counter from "@/components/counter";
import AuthContext from "@/feature/auth-context";

export default function Order() {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const fecthData = async () => {
    const res = await axios.post("/api/item", { id, name: "products" });
    const data = await res.data;
    setProduct(data);
    setLoading(true);
  };
  const handleAddItem = async () => {
    const data = { ...product, id, quantity, uid: userInfo.uid };
    console.log(data);
    const res = await axios.post("/api/cart", data);
    const result = res.data;
    console.log(result);
  };
  useEffect(() => {
    fecthData();
  }, [id]);
  if (!loading) {
    return <Loader />;
  }
  return (
    <div className="container flex flex-between items-center m-auto min-h-screen">
      <div className="w-[60%] p-10 flex items-center">
        <Image
          src={product.img}
          className="w-[500px] h-[100%]"
          width={1000}
          height={1000}
          alt=""
        />
      </div>
      <div className="w-[40%] flex items-center">
        <div className="box-shadow w-[430px] page-with-bar p-10 rounded-3xl">
          <div className="border-b border-[#ccc]">
            <h2 className="text-4xl uppercase oswald my-6">{product.name}</h2>
            <span className="text-[#999] text-[15px] pb-4 block">
              {product.description}
            </span>
          </div>
          <h2 className="text-[24px] uppercase oswald my-6">Món của bạn</h2>
          <ul className="text-[15px]">
            <li className="flex">
              <span>Món chính : </span>
              <span className="font-bold">{product.name}</span>
            </li>
            <li className="  items-center justify-center">
              <span>Mô tả : </span>
              <span className="font-bold ">{product.description}</span>
            </li>
          </ul>
          <hr />
          <div className="flex justify-between">
            <Counter
              decrement={() => setQuantity(quantity - 1)}
              increment={() => setQuantity(quantity + 1)}
              quantity={quantity}
              block={true}
            />
            <button
              onClick={handleAddItem}
              className="bg-red-600 p-4 rounded-full my-4 text-sm text-white btn-shadow roboto font-bold"
            >
              Thêm vào giỏ {quantity * product.price}₫
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
