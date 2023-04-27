import Link from "next/link";
import NavMenu from "./nav-menu";

export default function Header() {
  return (
    <div className="z-[99] sticky top-0 w-[100vw] border-b-[1px] border-[#ccc]">
      <div className="container m-auto flex flex-row justify-between items-center p-4">
        <ul className="flex flex-row items-center">
          <li>
            <Link href="/" className="block logo-url"></Link>
          </li>
          <li className="text-hover px-4">
            <Link
              className="text-md uppercase roboto font-extrabold"
              href="/thuc-don"
            >
              Thực đơn
            </Link>
          </li>
          <li className="text-hover px-4">
            <Link
              className="text-md uppercase roboto font-extrabold"
              href="/thuc-don"
            >
              Thực đơn
            </Link>
          </li>
          <li className="text-hover px-4">
            <Link
              className="text-md uppercase roboto font-extrabold"
              href="/thuc-don"
            >
              Thực đơn
            </Link>
          </li>
          <li className="text-hover px-4">
            <Link
              className="text-md uppercase roboto font-extrabold"
              href="/thuc-don"
            >
              Thực đơn
            </Link>
          </li>
        </ul>
        <NavMenu />
      </div>
    </div>
  );
}
