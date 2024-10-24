import React, { useEffect, useState } from "react";
import { db, storage } from '@/feature/firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Admin from "./layouts/Admin";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const sortedProducts = products.sort((a, b) => b.timestamp - a.timestamp);



  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    };

    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'DanhMucSach'));
      const categoriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesList);
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !imageFile || selectedCategories.length === 0) return;
  
    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
  
      const timestamp = new Date(); // Lấy thời gian hiện tại
  
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        img: url,
        categories: selectedCategories,
        timestamp: timestamp.toISOString(), // Lưu thời gian dưới dạng chuỗi ISO
      });
  
      setProducts([...products, { name, price: parseFloat(price), img: url, categories: selectedCategories, timestamp: timestamp.toISOString() }]);
      resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !author || !selectedCategory || !description || !currentProduct) return;

    try {
      let url = imageURL;

      if (imageFile) {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        url = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, 'products', currentProduct.id), {
        name,
        price: parseFloat(price),
        author,
        categories: selectedCategory,
        mota: description,
        img: url,
      });

      setProducts(products.map((product) =>
        product.id === currentProduct.id ? { ...product, name, price: parseFloat(price), author, categories: selectedCategory, mota: description, img: url } : product
      ));

      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setName(product.name);
    setPrice(product.price);
    setAuthor(product.author);
    setSelectedCategory(product.categories);
    setDescription(product.mota);
    setImageURL(product.img);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteDoc(doc(db, 'products', productToDelete));
      setProducts(products.filter(product => product.id !== productToDelete));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setAuthor('');
    setSelectedCategory('');
    setDescription('');
    setImageFile(null);
    setImageURL('');
    setCurrentProduct(null);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product => {
    const normalizedProductName = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const normalizedSearchTerm = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return normalizedProductName.toLowerCase().includes(normalizedSearchTerm.toLowerCase());
  });

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Logic for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="relative container mx-auto p-4 mb-6 top-[100px]">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Thêm sản phẩm mới
      </button>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg table-auto">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-4 px-6 border-b text-left">Tên sản phẩm</th>
            <th className="py-4 px-6 border-b text-left">Giá</th>
            <th className="py-4 px-6 border-b text-left">Tác giả</th>
            <th className="py-4 px-6 border-b text-left">Thể loại</th>
            <th className="py-4 px-6 border-b text-left w-1/4">Mô tả</th>
            <th className="py-4 px-6 border-b text-center w-1/6">Hình ảnh</th>
            <th className="py-4 px-6 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.id} className="hover:bg-gray-100 transition-colors">
              <td className="py-4 px-6 border-b text-left">{product.name}</td>
              <td className="py-4 px-6 border-b text-left">${product.price}</td>
              <td className="py-4 px-6 border-b text-left">{product.author}</td>
              <td className="py-4 px-6 border-b text-left">{product.categories}</td>
              <td className="py-4 px-6 border-b text-left truncate max-w-xs">
                {product.mota && product.mota.length > 50 ? `${product.mota.slice(0, 50)}...` : product.mota || "Không có mô tả"}
              </td>
              <td className="py-4 px-14 border-b text-center">
                <img src={product.img} alt={product.name} className="w-16 h-16 object-cover rounded" />
              </td>
              <td className="py-4 px-6 border-b text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded shadow hover:bg-yellow-500 transition w-24"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => openDeleteModal(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition w-24"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Thêm sản phẩm mới</h2>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(category.name)
                          ? prev.filter((cat) => cat !== category.name) // Nếu đã chọn thì bỏ chọn
                          : [...prev, category.name] // Nếu chưa chọn thì thêm vào
                      );
                    }}
                    className={`px-4 py-2 rounded ${selectedCategories.includes(category.name) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Mô tả sản phẩm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="number"
                placeholder="Giá sản phẩm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="border p-2 mb-2 w-full"
                required
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Thêm
                </button>
                <button type="button" onClick={resetForm} className="bg-red-500 text-white px-4 py-2 rounded">
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Chỉnh sửa sản phẩm</h2>
            <form onSubmit={handleUpdateProduct}>
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              >
                <option value="">Chọn thể loại</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <textarea
                placeholder="Mô tả sản phẩm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="number"
                placeholder="Giá sản phẩm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="border p-2 mb-2 w-full"
              />
              {imageURL && <img src={imageURL} alt={name} className="w-16 h-16 object-cover mb-2" />}
              <div className="flex justify-between">
                <button type="submit" className="bg-yellow-400 text-white px-4 py-2 rounded">
                  Cập nhật
                </button>
                <button type="button" onClick={resetForm} className="bg-red-500 text-white px-4 py-2 rounded">
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Xóa sản phẩm</h2>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            <div className="flex justify-between mt-4">
              <button onClick={handleDeleteProduct} className="bg-red-500 text-white px-4 py-2 rounded">
                Xóa
              </button>
              <button onClick={closeDeleteModal} className="bg-gray-500 text-white px-4 py-2 rounded">
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Dashboard.layout = Admin;
