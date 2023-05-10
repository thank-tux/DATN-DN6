import AuthContext from "@/feature/auth-context";
import Image from "next/image";
import { useContext } from "react";
import { useRouter } from "next/router";
import CartContext from "@/feature/cart-context";
import axios from "axios";

export default function CardFood({ description, name, img, price, id }) {
  const { userInfo } = useContext(AuthContext);
  const { increment, quantityInfo } = useContext(CartContext);
  const handleAdd = () => {
    increment(quantityInfo);
    const res = axios.post("/api/cart");
  };
  const router = useRouter();
  return (
    <div className="relative rounded list-shadow p-[10px]">
      <div className="overflow-hidden">
        <Image
          className="min-h-48 w-full hover:scale-110 duration-700"
          src={img}
          width={200}
          height={200}
          alt=""
        />
      </div>
      <div className="roboto flex flex-row items-baseline justify-between px-2 text-xl font-semibold capitalize">
        <span>{name}</span>
        <span>{price}₫</span>
      </div>
      <p className="font-medium px-2 py-3 text-justify break-words pb-14 text-[14px] text-[#444]">
        {description}
      </p>
      <div className="absolute left-0 bottom-[10px] px-2 pb-2 w-[100%]">
        <button
          onClick={userInfo ? handleAdd : () => router.push("/login")}
          className={`btn-shadow w-[100%] ${
            userInfo ? "bg-[#e4002b]" : "bg-[#ccc]"
          } rounded-full py-2 cursor-pointer font-bold text-white`}
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
