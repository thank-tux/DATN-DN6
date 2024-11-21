import { useState, useEffect } from "react";
import { db } from "@/feature/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import CardBook from "@/components/card-book";
import Loader from "@/components/loader";
import SortOptions from "@/components/SortOption";

const CategoryPage = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default"); // Trạng thái sắp xếp mặc định
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("categories", "array-contains", category), where("visible", "==", true));
      const querySnapshot = await getDocs(q);

      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setLoading(true);
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    // Sắp xếp sản phẩm theo tùy chọn
    let sorted = [...products];
    if (sortOption === "newest") {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sản phẩm mới nhất
    } else if (sortOption === "price-low-high") {
      sorted.sort((a, b) => a.price - b.price); // Giá thấp - cao
    } else if (sortOption === "price-high-low") {
      sorted.sort((a, b) => b.price - a.price); // Giá cao - thấp
    }
    setSortedProducts(sorted);
  }, [sortOption, products]);

  if (!loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-left my-6 uppercase text-blue-600">{category}</h1>

      {/* Nút sắp xếp */}
      <SortOptions sortOption={sortOption} setSortOption={setSortOption} />

      {/* Hiển thị các sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id}>
            <CardBook {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { path } = context.params;

  const categoryRef = collection(db, "DanhMucSach");
  const q = query(categoryRef, where("path", "==", path));
  const categorySnapshot = await getDocs(q);

  if (!categorySnapshot.empty) {
    const category = categorySnapshot.docs[0].data().name;
    return {
      props: { category },
    };
  }

  return {
    notFound: true,
  };
}

export default CategoryPage;
