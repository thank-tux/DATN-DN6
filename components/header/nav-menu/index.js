import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export default function NavMenu() {
  const [quantity, setQuantity] = useState("logo-empty-cart");
  return (
    <div className="flex flex-row items-center">
      <FaUserCircle className="w-8 h-8 mx-2 cursor-pointer" />
      <div
        className={`${quantity} cursor-pointer mx-2 bg-[url('https://kfcvn-static.cognizantorderserv.com/images/web/cart.png?v=5.0')] bg-no-repeat w-[30px] h-[43px] bg-[length:350%]`}
      ></div>
      <GiHamburgerMenu className="w-8 h-8 mx-2 cursor-pointer" />
    </div>
  );
}
