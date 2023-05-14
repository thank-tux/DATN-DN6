import { Link as LinkScroll } from "react-scroll";

export default function NavScroll({ type }) {
  return (
    <div className="fixed left-0 w-[100%] flex flex-grow m-auto flex bg-white z-[10] text-xl text-[rgba(0,0,0,.5)] uppercase font-bold tracking-tight">
      <ul className="container m-auto flex oswald justify-between border-b-[1px] py-4">
        {type &&
          type.map((item, index) => {
            return (
              <li
                key={index}
                className={`px-5 cursor-pointer text-hover  hover:text-black`}
              >
                <LinkScroll
                  to={item.path}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={500}
                >
                  {item.name}
                </LinkScroll>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
