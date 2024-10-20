import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Hàm loại bỏ dấu và chuyển thành chữ thường
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const searchProductsByName = async (searchTerm) => {
  const productsRef = collection(db, "products");

  // Loại bỏ dấu và chuyển từ khóa tìm kiếm sang chữ thường
  const normalizedSearchTerm = removeAccents(searchTerm);

  // Lấy toàn bộ sản phẩm và lọc theo tên
  const q = query(productsRef);
  const querySnapshot = await getDocs(q);

  const matchingProducts = [];
  querySnapshot.forEach((doc) => {
    const product = doc.data();

    // Loại bỏ dấu và chuyển tên sản phẩm thành chữ thường trước khi so sánh
    if (removeAccents(product.name).includes(normalizedSearchTerm)) {
      matchingProducts.push({ id: doc.id, ...product });
    }
  });

  return matchingProducts;
};
