import Image from "next/image";
import { GrFormNext } from "react-icons/gr";

export default function CardList({ link, name }) {
  return (
    <div className="list-shadow w-[265px] overflow-hidden rounded">
      <div className="overflow-hidden">
        <Image
          className="w-[265px] h-[223px] hover:scale-110 duration-700"
          src={link}
          width={500}
          height={500}
          alt=""
        />
      </div>
      <span className="flex cursor-pointer flex-row items-center p-3 text-sm font-bold capitalize">
        {name} <GrFormNext className="w-6 h-6" />
      </span>
    </div>
  );
}
