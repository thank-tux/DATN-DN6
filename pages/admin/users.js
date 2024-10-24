import React, { useEffect, useState } from 'react';
import { db } from '@/feature/firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Admin from "./layouts/Admin";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(usersList);
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        try {
            await deleteDoc(doc(db, 'users', id));
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        (user.account && user.account.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    return (
        <div className="relative container mx-auto p-4 mb-6 top-[100px]">
            <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>

            <input
                type="text"
                placeholder="Tìm kiếm theo tài khoản, tên hoặc số điện thoại"
                value={searchTerm}
                onChange={handleSearch}
                className="border p-2 mb-4 w-full"
            />
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg table-auto">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="w-1/4 py-3 px-4 border-b text-left">Tài khoản</th>
                        <th className="w-1/4 py-3 px-4 border-b text-left">Tên</th>
                        <th className="w-1/4 py-3 px-4 border-b text-left">Số điện thoại</th>
                        <th className="w-1/4 py-3 px-4 border-b text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-100 transition-colors">
                            <td className="py-3 px-4 border-b text-left">{user.account}</td>
                            <td className="py-3 px-4 border-b text-left">{user.name}</td>
                            <td className="py-3 px-4 border-b text-left">{user.phone}</td>
                            <td className="py-3 px-4 border-b text-center">
                                <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>



        </div>
    );
};

export default UsersPage;
UsersPage.layout = Admin;
