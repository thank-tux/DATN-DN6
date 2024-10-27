/* eslint-disable @next/next/no-img-element */
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
  const [publisher, setPublisher] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
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
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsList);
  };
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

  //Add sản phẩm
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !imageFile || selectedCategories.length === 0) return;
    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
      const timestamp = new Date();
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        img: url,
        author,
        publisher,
        releaseDate,
        mota: description,
        categories: selectedCategories,
        timestamp: timestamp.toISOString(),
      });
      setProducts([...products, { name, price: parseFloat(price), author, publisher, releaseDate, mota: description, img: url, categories: selectedCategories, timestamp: timestamp.toISOString() }]);
      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !author || !selectedCategories.length || !description || !currentProduct) return;
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
        publisher,
        releaseDate,
        categories: selectedCategories,
        mota: description,
        img: url,
      });
      setProducts(products.map((product) =>
        product.id === currentProduct.id
          ? { ...product, name, price: parseFloat(price), author, publisher, releaseDate, categories: selectedCategories, mota: description, img: url }
          : product
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
    setPublisher(product.publisher);
    setReleaseDate(product.releaseDate);
    setSelectedCategories(product.categories);
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
    setPublisher('');
    setReleaseDate('');
    setSelectedCategories('');
    setDescription('');
    setImageFile(null);
    setImageURL('');
    setPreviewImage('');
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  return (
    <div className="relative container mx-auto p-4 mb-6 top-[100px]">
      <h1 className="text-2xl font-bold mb-4">QUẢN LÝ SÁCH</h1>
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
            <th className="py-4 px-6 border-b text-center">Hình ảnh</th>
            <th className="py-4 px-6 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.id} className="hover:bg-gray-100 transition-colors">
              <td className="py-4 px-6 border-b text-left font-semibold">{product.name}</td>
              <td className="py-4 px-6 border-b text-left text-red-500 font-bold">
                {product.price.toLocaleString("vi-VN")} vn₫
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
                        <i className="fas fa-pen"></i>
                  </button>
                  <button
                    onClick={() => openDeleteModal(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition w-24"
                  >
                       <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4" >
              Thêm sản phẩm mới</h2>
            <form onSubmit={handleAddProduct}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                    <input
                      type="text"
                      placeholder="Tên sản phẩm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Giá</label>
                    <input
                      type="number"
                      placeholder="Giá"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tác giả</label>
                    <input
                      type="text"
                      placeholder="Tác giả"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nhà xuất bản</label>
                    <input
                      type="text"
                      placeholder="Nhà xuất bản"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Năm phát hành</label>
                    <input
                      type="text"
                      placeholder="Năm phát hành"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button" // Thêm type="button" để ngăn submit form
                        onClick={() => {
                          setSelectedCategories((prev) =>
                            prev.includes(category.name)
                              ? prev.filter((cat) => cat !== category.name)
                              : [...prev, category.name]
                          );
                        }}
                        className={`px-4 py-2 rounded ${selectedCategories.includes(category.name)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium mb-1">Hình ảnh</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="border p-2 w-full mb-2"
                    required
                  />
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="w-full h-auto rounded-lg mt-2" />
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition ml-2"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isEditModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl"> {/* Mở rộng chiều rộng modal */}
            <h2 className="text-xl font-bold mb-4">Sửa sản phẩm</h2>
            <form onSubmit={handleUpdateProduct}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block mb-1 font-bold">Tên sản phẩm</label>
                      <input
                        type="text"
                        placeholder="Tên sản phẩm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold">Giá</label>
                      <input
                        type="number"
                        placeholder="Giá"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border p-2 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold">Tác giả</label>
                      <input
                        type="text"
                        placeholder="Tác giả"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="border p-2 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold">Nhà xuất bản</label>
                      <input
                        type="text"
                        placeholder="Nhà xuất bản"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        className="border p-2 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold">Năm phát hành</label>
                      <input
                        type="text"
                        placeholder="Năm phát hành"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="border p-2 w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedCategories((prev) =>
                            prev.includes(category.name)
                              ? prev.filter((cat) => cat !== category.name)
                              : [...prev, category.name]
                          );
                        }}
                        className={`px-4 py-2 rounded ${selectedCategories.includes(category.name) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  <div className="block mb-1">
                    <label className="block mb-1 font-bold">Mô tả</label>
                    <textarea
                      placeholder="Mô tả"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border p-2 w-full mb-4 h-[200px]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold">Tải lên hình ảnh mới</label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setImageFile(file);
                        if (file) {
                          const url = URL.createObjectURL(file); // Tạo URL cho tệp đã chọn
                          setImageURL(url); // Cập nhật URL hình ảnh
                        }
                      }}
                      className="border p-2 w-full"
                    />
                  </div>
                </div>

                {/* Cột hiển thị hình ảnh sản phẩm */}
                <div className="flex justify-center items-center">
                  {imageURL && (
                    <img src={imageURL} alt="Hình ảnh sản phẩm" className="max-w-full max-h-[300px] object-contain rounded" />
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition ml-2"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}





      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-lg font-bold mb-4">Bạn có chắc chắn muốn xóa sản phẩm này?</h2>
            <div className="flex justify-center">
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition mr-2"
              >
                Xóa
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400 transition disabled:opacity-50"
        >
          Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400 transition disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}

Dashboard.layout = Admin;
