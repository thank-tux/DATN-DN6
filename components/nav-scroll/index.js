import { useRef, useState } from "react";
import { Link as LinkScroll } from "react-scroll";

export default function NavScroll({ type }) {
  const ref = useRef(null);
  const [menu, setMenu] = useState(type[0]);
  const setting = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  return (
    <div className="fixed left-0 w-[100%] flex flex-grow m-auto flex bg-white z-[10] text-xl text-[rgba(0,0,0,.5)] uppercase font-bold tracking-tight">
      <ul className="container m-auto flex oswald justify-rounded border-b-[1px] py-4">
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
