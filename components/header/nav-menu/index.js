import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router"; // Import useRouter từ Next.js
import AuthContext from "@/feature/auth-context";
import { searchProductsByName } from "@/feature/search-products";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

export default function NavMenu({ callback }) {
  const { userInfo, quantityCart } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter(); // Khai báo useRouter
  const searchBoxRef = useRef(null); // Sử dụng useRef để tham chiếu đến hộp tìm kiếm

  // Tìm kiếm sản phẩm khi người dùng thay đổi từ khóa
  useEffect(() => {
    if (searchTerm) {
      const fetchResults = async () => {
        const results = await searchProductsByName(searchTerm);
        // Lọc ra những sản phẩm có `isVisible` là `true`
        const visibleResults = results.filter((products) => products.visible);
        setSearchResults(visibleResults);
      };
      fetchResults();
    } else {
      setSearchResults([]); 
    }
  }, [searchTerm]);
  

  // Ẩn thanh kết quả tìm kiếm khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setSearchResults([]); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn submit form mặc định
    router.push(`/search-result?query=${searchTerm}`); // Điều hướng đến trang kết quả tìm kiếm với query string
  };

  return (
    <div className="flex flex-row items-center">
      <form className="max-w-md mx-auto" onSubmit={handleSearchSubmit} ref={searchBoxRef}>
        <label htmlFor="default-search" className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              aria-hidden="true"
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
            className="block w-[450px] p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Hiển thị toàn bộ kết quả tìm kiếm nhưng chỉ thấy tối đa 4 sản phẩm, có thêm scroll */}
        {searchResults.length > 0 && (
  <div className="absolute z-10 mt-2 w-[450px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
    <ul>
      {searchResults.map((product) => (
        <li key={product.id} className="p-2 hover:bg-gray-100 cursor-pointer">
          <Link href={`/kham-pha/order/${product.id}`}>
            <div className="flex items-center space-x-4">
              <img
                src={product.img}
                alt={product.name}
                className="w-10 h-10 object-cover"
              />
              <div>
                <span className="block font-medium">{product.name}</span>
                {/* Thêm thể loại của sản phẩm */}
                <span className="block text-sm text-gray-500">
                   {product.categories.join(", ")}
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)}

      </form>

      <Link className="mx-2" href={`${userInfo ? "/user" : "/login"}`}>
        <FaUserCircle className="w-8 h-8 cursor-pointer" />
      </Link>
      <Link className="mx-2" href="/cart">
        <div
          className={`${
            quantityCart !== 0 ? "logo-cart" : "logo-empty-cart"
          } cursor-pointer leading-[50px] text-center bg-[url('https://cdn-icons-png.flaticon.com/128/34/34568.png')] bg-no-repeat w-[45px] h-[38px] bg-[length:70%]`}
        >
          <span className="text-[15px] absolute top-[10px] left-[84%] translate-x-[-50%]">
            {quantityCart}
          </span>
        </div>
      </Link>
      <GiHamburgerMenu
        className="w-8 h-8 mx-2 cursor-pointer"
        // onClick={callback}
      />
    </div>
  );
}
