import axios from "axios";
import { useEffect, useState } from "react";
import ListBody from "@/components/list-body";
import Loader from "@/components/loader";
import CardBook from "@/components/card-book";
import NavScroll from "@/components/nav-scroll";
import { useRouter } from "next/router";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/feature/firebase/firebase"; // Đường dẫn tới file cấu hình Firebase
import Slider from "react-slick";
import { GrPrevious, GrNext } from "react-icons/gr";

export default function KhamPha() {
  const [products, setProducts] = useState(null);
  const [types, setTypes] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-[-20px] z-10 flex items-center justify-center bg-gray-700 text-white rounded-full w-10 h-10 hover:bg-gray-800"
      style={{ top: "40%" }}
    >
      <GrPrevious />
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-[-20px] z-10 flex items-center justify-center bg-gray-700 text-white rounded-full w-10 h-10 hover:bg-gray-800"
      style={{ top: "40%" }}
    >
      <GrNext />
    </button>
  );

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  async function fetchType() {
    try {
      const res = await axios.get("/api/favourite");
      const data = await res.data;
      setTypes(data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục yêu thích:", error);
    }
  }

  async function fetchProducts() {
    try {
      const productQuery = query(
        collection(db, "products"),
        where("visible", "==", true),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(productQuery);
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productList);
      setLoading(true);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm từ Firebase:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchType();
  }, []);

  if (!loading) {
    return <Loader />;
  }

  return (
    <div className="container m-auto">
      <NavScroll type={types} />
      {types &&
        types.map((item, index) => (
          <div key={index} className="container m-auto pt-20" id={item.path}>
            <h2 className="text-[28px] font-bold uppercase p-4">
              {item.name}
            </h2>
            <div className="relative">
              <Slider {...settings}>
                {products &&
                  products.map(
                    (_item, _index) =>
                      Array.isArray(_item.categories) &&
                      _item.categories.includes(item.name) && (
                        <div key={_index} className="p-2">
                          <CardBook {..._item} />
                        </div>
                      )
                  )}
              </Slider>
            </div>
          </div>
        ))}
    </div>
  );
}
