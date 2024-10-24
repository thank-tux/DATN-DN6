import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick"; // Import Slider
import SliderPanes from "@/components/slider";
import ListBody from "@/components/list-body";
import CardList from "@/components/card-list";
import CardBook from "@/components/card-book";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; // Import slick-carousel styles
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import Font Awesome icons
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../feature/firebase/firebase"; // Đường dẫn tới file cấu hình Firebase
export default function Home() {
  const [listBook, setListBook] = useState(null);
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);

  

  // Slider ref
  const sliderRef = useRef(null);

  async function fetchData() {
    const res = await axios.get("/api/favourite");
    const data = await res.data;
    setListBook(data);
    setLoading(true);
  }

  async function fetchBook() {
    const res = await axios.get("/api/product");
    const data = await res.data;
    setBooks(data);
  }

  useEffect(() => {
    fetchData();
    fetchBook();
  }, []);

  const sliderProducts = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,  // Number of slides to show at once
    slidesToScroll: 1,
    autoplay: true,  // Autoplay enabled
    autoplaySpeed: 3000,  // Change slide every 3 seconds
    nextArrow: null,  // Disable default next arrow
    prevArrow: null,  // Disable default prev arrow
  };

  return (
    <div className="min-h-screen">
      <SliderPanes />
      <div className="container m-auto mt-4 p-10">
        <h2 className="font-bold text-3xl flex items-center tracking-[2px] oswald line-space my-8">
          <div className="h-[77px] icon-avatar"></div>
          <span className="relative pl-2 bg-white">
            SÁCH MỚI CẬP NHẬT
          </span>
        </h2>
        
        {/* Sản phẩm mới nhất trong slider */}
        <div className="relative p-10">
          <Slider ref={sliderRef} {...sliderProducts}>
            {books &&
              books
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
                .slice(0, 8) // Limit to 8 items
                .map((item, index) => (
                  <div key={index}>
                    <CardBook {...item} />
                  </div>
                ))}
          </Slider>
          {/* Nút Previous */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
            onClick={() => sliderRef.current.slickPrev()}
          >
            <FaChevronLeft size={30} /> {/* Icon Previous */}
          </button>
          {/* Nút Next */}
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
            onClick={() => sliderRef.current.slickNext()}
          >
            <FaChevronRight size={30} /> {/* Icon Next */}
          </button>
        </div>

        <h2 className="font-bold text-3xl tracking-[2px] oswald line-space mb-8">
          <span className="relative bg-white">DANH MỤC SẢN PHẨM</span>
        </h2>
        <ListBody>
          {loading &&
            listBook.map((item, index) => <CardList key={index} {...item} />)}
        </ListBody>
        <h2 className="font-bold text-3xl flex items-center tracking-[2px] oswald line-space my-8">
          <div className="h-[77px] icon-avatar"></div>
          <span className="relative pl-2 bg-white">
            CÓ THỂ BẠN SẼ THÍCH SẢN PHẨM NÀY
          </span>
        </h2>
        <ListBody>
          {books &&
            books.map((item, index) => {
              if (item.type === "2") {
                return <CardBook key={index} {...item} />;
              }
            })}
        </ListBody>
      </div>
    </div>
  );
}
