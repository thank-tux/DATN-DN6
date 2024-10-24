// pages/admin.js
import { useEffect, useState } from 'react';
import { db } from '@/feature/firebase/firebase'; 
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { storage } from '@/feature/firebase/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !imageFile) return;

    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        img: url,
      });

      setProducts([...products, { name, price: parseFloat(price), img: url }]);
      resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setName(product.name);
    setPrice(product.price);
    setImageURL(product.img);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !currentProduct) return;

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
        img: url,
      });

      setProducts(products.map((product) => 
        product.id === currentProduct.id ? { ...product, name, price: parseFloat(price), img: url } : product
      ));

      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setImageFile(null);
    setImageURL('');
    setCurrentProduct(null);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Logic for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <button 
        onClick={() => setIsAddModalOpen(true)} 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Thêm sản phẩm mới
      </button>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Tên sản phẩm</th>
            <th className="py-2 px-4 border-b">Giá</th>
            <th className="py-2 px-4 border-b">Hình ảnh</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.id} className="hover:bg-gray-100 transition-colors">
              <td className="py-2 px-4 border-b">{product.id}</td>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">${product.price}</td>
              <td className="py-2 px-4 border-b">
                <img src={product.img} alt={product.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleOpenEditModal(product)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-400 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="self-center">{`Trang ${currentPage} / ${totalPages}`}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-400 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>

      {/* Modal thêm sản phẩm */}
      {isAddModalOpen && (
        <div className="-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Thêm sản phẩm mới</h2>
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

      {/* Modal chỉnh sửa sản phẩm */}
      {isEditModalOpen && (
        <div className="-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Chỉnh sửa sản phẩm</h2>
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
                type="number"
                placeholder="Giá sản phẩm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 mb-2 w-full"
                required
              />
              {imageURL && <img src={imageURL} alt="Hình ảnh sản phẩm" className="w-16 h-16 mb-2" />}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="border p-2 mb-2 w-full"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
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
    </div>
  );
}
