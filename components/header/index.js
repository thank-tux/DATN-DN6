import Link from "next/link";
import NavMenu from "./nav-menu";
import Menu from "./menu";
import { useState } from "react";
import Image from "next/image";
import Logo from "/assets/logo.svg";
import { useRouter } from "next/router";



export default function Header() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const pathname = router.pathname.split("/");
  return (
    <div className="relative bg-white z-[99] sticky top-0 w-[100vw] border-b-[1px] border-[#ccc]">
      <div className="container m-auto flex flex-row justify-between items-center p-4">
        <Image className="md:hidden" src={Logo} width={70} height={30} alt="" />
        <ul className="flex-row items-center hidden md:flex">
          <li>
            <Link href="/" className="block logo-url"></Link>
          </li>
          <li className="pl-10 px-4">
            <Link
              className={`text-md uppercase roboto font-extrabold ${pathname[1] === "kham-pha" ? "text-cyan-500" : "text-gray-800"} hover:text-cyan-500`}
              href="/kham-pha"
            >
              Khám phá
            </Link>
          </li>
          <li className="px-4">
            <Link
              className={`text-md uppercase roboto font-extrabold ${pathname[1] === "gioi-thieu" ? "text-cyan-500" : "text-gray-800"} hover:text-cyan-500`}
              href="/gioi-thieu"
            >
              Giới thiệu
            </Link>
          </li>
          <li className="px-4">
            <Link
              className={`text-md uppercase roboto font-extrabold ${pathname[1] === "lien-he" ? "text-cyan-500" : "text-gray-800"} hover:text-cyan-500`}
              href="/lien-he"
            >
              Liên hệ
            </Link>
          </li>
        </ul>

        <NavMenu callback={() => setShow(!show)} />
      </div>
      <Menu show={show} callback={() => setShow(!show)} />
    </div>
  );
}
