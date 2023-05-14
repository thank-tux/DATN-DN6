import Image from "next/image";
import { useState } from "react";
import Counter from "../counter";
import { IoIosArrowDown } from "react-icons/io";

export default function CardCart({
  img,
  id,
  description,
  name,
  price,
  quantity,
}) {
  const [show, setShow] = useState(true);
  const [value, setValue] = useState(quantity);
  const handleDecrement = () => {
    setValue(value - 1);
  };
  const handleIncrement = () => {
    setValue(value + 1);
  };
  return (
    <div className="flex  p-3 box-shadow my-4 relative rounded">
      <Image src={img} alt="" width={200} height={200} />
      <div className="p-4 flex flex-col justify-between">
        <h2 className="font-bold capitalize">{name}</h2>
        <div>
          <span
            onClick={() => setShow(!show)}
            className="flex text-xs text-[#333] mt-2 cursor-pointer flex items-center"
          >
            Xem chi tiết
            <IoIosArrowDown className={`w-5 h-5 ${!show && "rotate-180"}`} />
          </span>
          <p
            className={`${
              show ? "hidden" : "block"
            } w-[45%] text-[#999] text-[15px] block`}
          >
            {description}
          </p>
        </div>
        <span className="cursor-pointer hover:underline roboto">xóa</span>
      </div>
      <div className="absolute right-4 top-[50%]">
        <Counter
          price={price}
          quantity={value}
          decrement={handleDecrement}
          increment={handleIncrement}
        />
      </div>
    </div>
  );
}
