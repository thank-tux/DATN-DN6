import React, { useEffect, useState } from 'react';
import { db } from '@/feature/firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { storage } from '@/feature/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Admin from "./layouts/Admin";

const DanhMucSach = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState('');
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const querySnapshot = await getDocs(collection(db, 'DanhMucSach'));
            const categoriesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoriesList);
        };

        fetchCategories();
    }, []);

    const createPath = (name) => {
        return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '');
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!name || !imgFile) return;

        try {
            const storageRef = ref(storage, `images/${imgFile.name}`);
            await uploadBytes(storageRef, imgFile);
            const url = await getDownloadURL(storageRef);

            const path = createPath(name);

            await addDoc(collection(db, 'DanhMucSach'), {
                name,
                img: url,
                path,
            });

            setCategories([...categories, { name, img: url, path }]);
            resetForm();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleOpenEditModal = (category) => {
        setCurrentCategory(category);
        setName(category.name);
        setImgURL(category.img);
        setIsEditModalOpen(true);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (!name || !currentCategory) return;

        try {
            let url = imgURL;

            if (imgFile) {
                const storageRef = ref(storage, `images/${imgFile.name}`);
                await uploadBytes(storageRef, imgFile);
                url = await getDownloadURL(storageRef);
            }

            const path = createPath(name);

            await updateDoc(doc(db, 'DanhMucSach', currentCategory.id), {
                name,
                img: url,
                path,
            });

            setCategories(categories.map((category) =>
                category.id === currentCategory.id ? { ...category, name, img: url, path } : category
            ));

            resetForm();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const confirmDeleteCategory = (id) => {
        setDeleteCategoryId(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteCategory = async () => {
        try {
            await deleteDoc(doc(db, 'DanhMucSach', deleteCategoryId));
            setCategories(categories.filter(category => category.id !== deleteCategoryId));
            setIsDeleteConfirmOpen(false);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const resetForm = () => {
        setName('');
        setImgFile(null);
        setImgURL('');
        setCurrentCategory(null);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCategories = categories.filter(category =>
        category.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(
            searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        )
    );

    return (
        <div className="relative container mx-auto p-4 mb-6 top-[100px]">
            <h1 className="text-2xl font-bold mb-4">Danh mục sách</h1>

            <input
                type="text"
                placeholder="Tìm kiếm theo tên không dấu"
                value={searchTerm}
                onChange={handleSearch}
                className="border p-2 mb-4 w-full"
            />

            <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Thêm danh mục mới
            </button>

            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                <thead>
                <tr className="bg-blue-500 text-white">
                        <th className="py-3 px-4 border-b font-semibold text-center">ID</th>
                        <th className="py-3 px-4 border-b font-semibold text-center">Tên danh mục</th>
                        <th className="py-3 px-4 border-b font-semibold text-center">Hình ảnh</th>
                        <th className="py-3 px-4 border-b font-semibold text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map(category => (
                        <tr key={category.id} className="hover:bg-gray-100 transition-colors">
                            <td className="py-3 px-4 border-b text-center">{category.id}</td>
                            <td className="py-3 px-4 border-b text-center font-bold">{category.name}</td>
                            <td className="py-3 px-4 border-b text-center">
                                <img src={category.img} alt={category.name} className="w-16 h-16 object-cover mx-auto" />
                            </td>
                            <td className="py-3 px-4 border-b text-center">
                                <button onClick={() => handleOpenEditModal(category)} className="bg-yellow-500 text-white px-3 py-1 rounded mx-1">
                                    Sửa
                                </button>
                                <button onClick={() => confirmDeleteCategory(category.id)} className="bg-red-500 text-white px-3 py-1 rounded mx-1">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isAddModalOpen && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-2">Thêm danh mục mới</h2>
                        <form onSubmit={handleAddCategory}>
                            <input
                                type="text"
                                placeholder="Tên danh mục"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-2 mb-2 w-full"
                                required
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImgFile(e.target.files[0])}
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

            {isEditModalOpen && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-2">Chỉnh sửa danh mục</h2>
                        <form onSubmit={handleUpdateCategory}>
                            <input
                                type="text"
                                placeholder="Tên danh mục"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-2 mb-2 w-full"
                                required
                            />
                            {imgURL && <img src={imgURL} alt="Hình ảnh danh mục" className="w-16 h-16 mb-2" />}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImgFile(e.target.files[0])}
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

            {isDeleteConfirmOpen && (
                <div className="modal-overlay" onClick={() => setIsDeleteConfirmOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-2">Xác nhận xóa danh mục</h2>
                        <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleDeleteCategory}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

DanhMucSach.layout = Admin;
export default DanhMucSach;
