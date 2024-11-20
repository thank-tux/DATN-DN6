/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { searchProductsByName } from "@/feature/search-products";
import Link from "next/link"; // Nhập Link từ Next.js

// Hàm để định dạng giá tiền
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu "." vào các đơn vị
};

export default function SearchResult() {
  const router = useRouter();
  const { query } = router.query; // Lấy từ khóa từ URL
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        const results = await searchProductsByName(query);
        // Lọc ra những sản phẩm có `isVisible` là `true`
        const visibleResults = results.filter((products) => products.visible);
        setSearchResults(visibleResults);
      };
      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen">
      <div className="container m-auto mt-4 p-10">
        <h2 className="font-bold text-3xl flex items-center tracking-[2px] oswald line-space my-8">
          <div className="h-[77px] icon-avatar"></div>
          <span className="relative pl-2 bg-white">Kết quả tìm kiếm cho "{query}"</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div key={product.id} className="border p-2 w-[250px] h-[400px] rounded-lg shadow-md flex flex-col justify-between">
                <Link href={`/kham-pha/order/${product.id}`}>
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-[300px] mb-2 object-cover rounded" // Điều chỉnh chiều cao hình ảnh
                  />
                </Link>
                <div className="flex flex-col items-center mb-1">
                  <h3 className="text-md font-bold text-center uppercase"> {/* Chỉnh kích thước font cho tên sản phẩm thành nhỏ hơn */}
                    <Link href={`/kham-pha/order/${product.id}`} className="font-semibold text-black-600 hover:text-green-600">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-lg font-bold text-red-600 text-center uppercase"> {/* Thay đổi màu chữ thành đỏ cho giá tiền */}
                    {formatPrice(product.price)} VND
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy sản phẩm nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
