import { useContext } from "react";
import AuthContext from "@/feature/auth-context";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

export default function NavMenu({ callback }) {
  const { userInfo, quantityCart } = useContext(AuthContext);

  return (
    
    <div className="flex flex-row items-center">
       <form className="max-w-md mx-auto">
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-[450px] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Tìm kiếm..."
          required
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
      <Link className="mx-2" href={`${userInfo ? "/user" : "/login"}`}>
        <FaUserCircle className="w-8 h-8 cursor-pointer" />
      </Link>
      <Link className="mx-2" href="/cart">
        <div
          className={`${
            quantityCart !== 0 ? "logo-cart" : "logo-empty-cart"
          } cursor-pointer leading-[50px] tracking-[-1px] text-center bg-[url('https://cdn-icons-png.flaticon.com/128/34/34568.png')] bg-no-repeat w-[45px] h-[38px] bg-[length:70%]`}
        >
          <span className="roboto text-[15px] absolute top-[10px] left-[84%] translate-x-[-50%]">{quantityCart}</span>
        </div>
      </Link>
      <GiHamburgerMenu
        className="w-8 h-8 mx-2 cursor-pointer"
        onClick={callback}
      />
    </div>
  );
}
