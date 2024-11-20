import AuthContext from "@/feature/auth-context";
import Image from "next/image";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import ButtonLoading from "../button-loading";
import { formatMoney } from "@/utils";

export default function CardBook({ description, name, img, price, id, visible }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { userInfo, increment } = useContext(AuthContext);

  const handleAdd = async () => {
    setLoading(true);
    const data = {
      description,
      name,
      img,
      price,
      id,
      uid: userInfo.uid,
      quantity: 1,
      visible,
    };

    const res = await axios.post("/api/cart", data);
    const { result } = await res.data;
    if (result === "success") {
      setLoading(false);
    }
    increment();
  };

  return (
    <div className="mb-4 mx-3 relative rounded-lg shadow-lg p-3 h-[480px] w-[250px] bg-white">
      <div className="relative overflow-hidden rounded-md h-[280px] w-full">
        <Link href={`/kham-pha/order/${id}`}>
            <Image
              className="object-cover hover:scale-105 transition-transform duration-500"
              src={img}
              alt="Product Image"
              layout="fill"
            />
        </Link>
      </div>
      <div className="roboto flex flex-col mt-3 px-2 uppercase">
        <Link href={`/kham-pha/order/${id}`} className="text-lg font-semibold capitalize !uppercase">
          {name}
        </Link>
        <span className="text-red-600 font-bold text-xl mt-1">
          {formatMoney(price)}₫
        </span>
      </div>

      <div className="absolute left-0 bottom-3 px-2 w-full">
        {!loading ? (
          <button
            onClick={userInfo ? handleAdd : () => router.push("/login")}
            className={`btn-shadow w-full bg-red-600 rounded-full py-2 cursor-pointer font-bold text-white transition-colors duration-300`}
          >
            Thêm
          </button>
        ) : (
          <ButtonLoading />
        )}
      </div>
    </div>
  );
}
