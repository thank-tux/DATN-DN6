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
      <div className="p-4">
        <h2 className="font-bold capitalize">{name}</h2>
        <div>
          <span
            onClick={() => setShow(!show)}
            className="flex text-xs text-[#ccc] mt-2 cursor-pointer"
          >
            Xem chi tiết <IoIosArrowDown />
          </span>
          <p
            className={`${show ? "hidden" : "block"} w-[45%] text-[#ccc] block`}
          >
            {description}
          </p>
        </div>
      </div>
      <Counter
        price={price}
        quantity={value}
        decrement={handleDecrement}
        increment={handleIncrement}
      />
    </div>
  );
}
