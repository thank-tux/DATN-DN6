import AuthContext from "@/feature/auth-context";
import Image from "next/image";
import { useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

export default function CardFood({ description, name, img, price, id }) {
  const { userInfo, quantityCart, increment } = useContext(AuthContext);
  const handleAdd = async () => {
    const data = {
      description,
      name,
      img,
      price,
      id,
      uid: userInfo.uid,
      quantity: 1,
    };
    const res = axios.post("/api/cart", data);
    console.log(await res);
    increment(quantityCart);
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
        <span>
          <Link href={`/thuc-don/order/${id}`}>{name}</Link>
        </span>
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
