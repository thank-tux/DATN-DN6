import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "@/components/loader";
import Image from "next/image";
import Counter from "@/components/counter";
import AuthContext from "@/feature/auth-context";
import CardBook from "@/components/card-book";
import ListBody from "@/components/list-body";


const LoginModal = ({ onClose }) => {
  const router = useRouter();

  return (
    <div className="-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập</h2>
        <p className="mb-6">Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded mr-4 hover:bg-gray-600"
          >
            Đóng
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Đến trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Order() {
  const { userInfo, increment } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);


  const fecthData = async () => {
    const res = await axios.post("/api/item", { id, name: "products" });
    const data = await res.data;
    setProduct(data);
    setLoading(true);
    // Gọi hàm lấy sản phẩm liên quan dựa trên các danh mục của sản phẩm hiện tại
    fecthRelatedProducts(data.categories);
  };

  const fecthRelatedProducts = async (categories) => {
    const res = await axios.get("/api/product");
    const data = res.data;

    // Lọc các sản phẩm có danh mục trùng khớp với danh mục hiện tại (categories)
    const filteredProducts = data.filter(
      (item) =>
        Array.isArray(item.categories) &&
        item.categories.some((category) => categories.includes(category)) &&
        item.id !== id
    );

    setRelatedProducts(filteredProducts);
  };

  const handleAddItem = async () => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }
    const data = { ...product, id, quantity, uid: userInfo.uid };
    const res = await axios.post("/api/cart", data);
    const { result } = res.data;
    if (result === "success") {
      increment(quantity);
    }
    // router.push("/thuc-don");
  };

  useEffect(() => {
    fecthData();
  }, [id]);

  if (!loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen">
      {/* Hiển thị modal nếu người dùng chưa đăng nhập */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <div className="flex flex-col md:flex-row items-start gap-10">
        {/* Hình ảnh sách */}
        <div
          className="w-full md:w-1/3 flex justify-center p-4 rounded-lg border border-gray-300 shadow-md"
          style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }} // Viền mờ cho khung chứa ảnh
        >
          <Image
            src={product.img}
            className="rounded-lg object-cover"
            width={300}
            height={400}
            alt={product.name}
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="w-full md:w-2/3 ">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {/* Tên sách */}
            <h2 className="text-4xl md:text-5xl font-bold uppercase oswald mb-4">
              {product.name}
            </h2>

            {/* Mô tả sách */}
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              {product.description}
            </p>

            {/* Chi tiết sản phẩm */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-2xl font-semibold uppercase mb-2">
                Chi tiết sản phẩm
              </h3>
              <ul className="text-gray-600 text-lg leading-8">
                <li><strong>Tên sách:</strong> {product.name}</li>
                <li><strong>Tác giả:</strong> {product.author || "Đang cập nhật"}</li>
                <li className="capitalize">
                  <strong>Thể loại:</strong>{" "}
                  {product.categories
                    ? product.categories.map((category) =>
                      category.charAt(0).toUpperCase() + category.slice(1)
                    ).join(', ')
                    : "Đang cập nhật"}
                </li>
                <li>
                  <strong>Giá:</strong>
                  <span className="text-red-600 text-xl ml-2 font-bold">
                    {product.price ? product.price.toLocaleString('vi-VN') : "Đang cập nhật"}₫
                  </span>
                </li>
              </ul>

            </div>

            {/* Nút Thêm vào giỏ và bộ đếm số lượng */}
            <div className="mt-6 flex items-center justify-between">
              <Counter
                decrement={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                increment={() => setQuantity(quantity + 1)}
                quantity={quantity}
                block={true}
              />
              <button
                onClick={handleAddItem}
                className="bg-red-600 py-3 px-6 rounded-lg text-white text-sm uppercase font-bold hover:bg-red-700 transition"
              >
                Thêm vào giỏ ({(quantity * product.price).toLocaleString('vi-VN')}₫)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Giới thiệu về sách và Thông tin chi tiết */}
      <div className="mt-12 flex flex-col md:flex-row gap-6">
        {/* Giới thiệu về sách */}
        <div className="w-full md:w-1/2">
          <h3 className="text-3xl font-bold uppercase mb-6">Giới thiệu về sách</h3>
          <p className="text-base font-civil text-gray-700 mb-4">
            {product.mota || "Đang cập nhật nội dung giới thiệu cho sách này."}
          </p>
        </div>

        {/* Thông tin chi tiết */}
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl font-bold uppercase mb-4">Thông tin chi tiết</h3>
          <div className="border border-gray-300 p-6 rounded-lg shadow-md">

            <ul className="list-disc list-inside text-gray-600 text-lg">
              <li><strong>Tác giả:</strong> {product.author || "Đang cập nhật"}</li>
              <li><strong>Nhà xuất bản:</strong> {product.publisher || "Đang cập nhật"}</li>
              <li><strong>Ngày phát hành:</strong> {product.releaseDate || "Đang cập nhật"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Phần "Có thể bạn cũng thích" */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-3xl font-bold uppercase mb-6">Có thể bạn cũng thích</h3>
          <ListBody>
            {relatedProducts.map((item) => (
              <CardBook key={item.id} {...item} />
            ))}
          </ListBody>
        </div>
      )}
    </div>
  );
}
