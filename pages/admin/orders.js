import React, { useEffect, useState } from 'react';
import { db } from '@/feature/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Admin from './layouts/Admin';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const querySnapshot = await getDocs(collection(db, 'previous-order'));
            const ordersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(ordersList);
        };

        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOrders = orders.flatMap(order =>
        order.items
            .filter(item =>
                (item.customer_info?.name && item.customer_info.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.customer_info?.phone && item.customer_info.phone.includes(searchTerm)) ||
                (item.address?.city && item.address.city.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map(item => ({
                ...item,
                orderId: order.id,
            }))
    );

    const handleCardClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleModalClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    return (
        <div className="relative container mx-auto p-4 mb-6 top-[100px]">
            <h1 className="text-2xl font-bold mb-4 uppercase">Danh sách đơn hàng</h1>

            <input
                type="text"
                placeholder="Tìm kiếm theo tên, số điện thoại hoặc thành phố"
                value={searchTerm}
                onChange={handleSearch}
                className="border p-2 mb-4 w-full"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredOrders.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(item)}
                        className="bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col">
                                <h2 className="text-blue-500 uppercase font-bold text-lg">Đơn hàng của: {item.customer_info?.name || "Chưa rõ"}</h2>
                                <p className="text-sm text-black-500 font-semibold">SĐT: {item.customer_info?.phone || "Chưa rõ"}</p>
                                <p className="text-sm text-black-500 font-semibold capitalize">Địa chỉ: {`${item.address?.home || "Chưa rõ"}, ${item.address?.wards || "Chưa rõ"}, ${item.address?.district || "Chưa rõ"}, ${item.address?.city || "Chưa rõ"}`}
                                </p>
                                <p className="text-sm text-black-500 font-semibold">Ngày: {item.date || "Chưa rõ"}</p>
                                <p className="text-sm text-black-500 font-semibold">
                                    Phương thức: {item.payment === 'delivery' ? 'Vận chuyển' : item.payment || "Chưa rõ"}
                                </p>
                                <p className="font-bold text-lg text-green-600">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={handleModalClick}
                >
                    <div className="bg-white rounded-lg p-6 max-w-5xl w-full overflow-y-auto">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-xl font-bold text-gray-500"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>

                        {/* Layout for Customer Info and Product List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Information */}
                            <div className="flex flex-col space-y-4 border p-4 rounded-lg shadow-sm bg-gray-50">
                                <p className="font-bold text-lg">Thông tin khách hàng:</p>
                                <p className="text-md font-semibold">Tên: {selectedOrder.customer_info?.name || "Chưa rõ"}</p>
                                <p className="text-md font-semibold">Số điện thoại: {selectedOrder.customer_info?.phone || "Chưa rõ"}</p>
                                <p className="text-md font-semibold capitalize">Địa chỉ: {`${selectedOrder.address?.home}, ${selectedOrder.address?.wards}, ${selectedOrder.address?.district}, ${selectedOrder.address?.city}`}</p>
                                <p className="text-md font-semibold">Ngày đặt hàng: {selectedOrder.date || "Chưa rõ"}</p>
                                <p className="text-md font-semibold">
                                    Phương thức thanh toán: {selectedOrder.payment === 'delivery' ? 'Vận chuyển' : selectedOrder.payment}
                                </p>

                            </div>

                            {/* Product List */}
                            <div className="flex flex-col space-y-4 border p-4 rounded-lg shadow-sm bg-gray-50">
                                <h3 className="text-xl font-semibold">Danh sách sản phẩm:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {selectedOrder.list_item.map((product, index) => (
                                        <div key={index} className="flex flex-col items-center bg-white border p-4 rounded-lg shadow-md">
                                            <img
                                                src={product.img} // Thêm trường ảnh từ sản phẩm
                                                alt={product.name}
                                                className="w-full h-48 object-cover mb-4 rounded-md"
                                            />
                                            <p className="font-semibold uppercase">{product.name}</p>
                                            <p className="font-bold text-lg text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="mt-6 text-xl font-bold text-green-600 text-right">
                            Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
OrdersPage.layout = Admin;
