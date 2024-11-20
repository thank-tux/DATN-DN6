import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ListBody from "@/components/list-body";
import CardBook from "@/components/card-book";
import Loader from "@/components/loader";
import NavScroll from "@/components/nav-scroll";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/feature/firebase/firebase";

export default function CategoryPage() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { category } = router.query;

  async function fetchTypes() {
    const typesSnapshot = await getDocs(collection(db, "DanhMucSach"));
    const typesList = typesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTypes(typesList);
  }

  async function fetchProducts() {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const productList = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
    setLoading(true);
  }

  useEffect(() => {
    fetchTypes();
    fetchProducts();
  }, []);

  if (!loading) {
    return <Loader />;
  }

  // Debugging: In ra sản phẩm và category
  console.log("Products:", products);
  console.log("Category from URL:", category);

  // Kiểm tra danh mục và lọc sản phẩm
  const filteredProducts = products.filter((product) =>
    Array.isArray(product.categories) ? product.categories.includes(category) : false
  );

  return (
    <div className="container m-auto">
      <NavScroll type={types} />
      <div className="pt-20">
        <h2 className="text-[28px] font-bold uppercase p-4">{category?.replace("-", " ")}</h2>
        <ListBody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <CardBook key={item.id} {...item} />
            ))
          ) : (
            <p>Không có sản phẩm nào trong danh mục này.</p>
          )}
        </ListBody>
      </div>
    </div>
  );
}
