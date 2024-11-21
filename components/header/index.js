import Link from "next/link";
import NavMenu from "./nav-menu";
import Menu from "./menu";
import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "/assets/logo.svg";
import { useRouter } from "next/router";
import { getData } from "@/feature/firebase/firebaseAuth"; // Import API call

export default function Header() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]); // State để lưu thể loại
  const pathname = router.pathname.split("/");

  // Fetch thể loại từ API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getData("DanhMucSach"); // Gọi API để lấy dữ liệu
        setCategories(data || []); // Lưu danh sách thể loại vào state
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

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
              className={`text-md capitalize roboto font-bold ${pathname[1] === "kham-pha" ? "text-cyan-500" : "text-gray-800"
                } hover:text-cyan-500`}
              href="/kham-pha"
            >
              Khám phá
            </Link>
          </li>
          <li className="px-4">
            <Link
              className={`text-md capitalize roboto font-bold ${pathname[1] === "gioi-thieu" ? "text-cyan-500" : "text-gray-800"
                } hover:text-cyan-500`}
              href="/gioi-thieu"
            >
              Giới thiệu
            </Link>
          </li>
          {/* Dropdown Sách Thiên Lý */}
          <li className="relative group px-4">
            <span className="text-md capitalize roboto font-extrabold text-gray-800 cursor-pointer hover:text-cyan-500">
              Sách Thiên Lý
            </span>
            <ul className="absolute left-0 top-full w-80 bg-white shadow-lg rounded-md hidden group-hover:block transition-all transform scale-95 group-hover:scale-100 grid grid-cols-2 gap-4 p-4">
              {categories.map((category) => (
                <li key={category.id} className="hover:bg-gray-200">
                  <Link
                    href={`/the-loai/${category.path}`} // Sử dụng path từ thể loại
                    className="block px-6 py-3 text-gray-700 hover:text-cyan-500 font-semibold"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="px-4">
            <Link
              className={`text-md capitalize roboto font-bold ${pathname[1] === "lien-he" ? "text-cyan-500" : "text-gray-800"
                } hover:text-cyan-500`}
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
