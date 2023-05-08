import { useRef, useState } from "react";
import { Link as LinkScroll } from "react-scroll";
import Slider from "react-slick";

export default function NavScroll({ type }) {
  console.log(type);
  const ref = useRef(null);
  const [menu, setMenu] = useState(type[0]);
  const setting = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  return (
    <div className="fixed w-[100%] flex bg-white z-[10] border-b-[1px] text-xl text-[rgba(0,0,0,.5)] uppercase font-bold tracking-tight py-4">
      <ul className="overflow-x-hidden">
        {type.map((item, index) => {
          return (
            <li
              key={index}
              className={`px-5 cursor-pointer text-hover  hover:text-black`}
            >
              <LinkScroll
                to={item}
                spy={true}
                smooth={true}
                offset={-200}
                duration={500}
              >
                {item}
              </LinkScroll>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
