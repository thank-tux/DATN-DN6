// components/Modal.js
export default function Modal({ message, onClose }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50"> {/* Đảm bảo modal phủ toàn bộ màn hình */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96"> {/* Điều chỉnh kích thước modal */}
          <h2 className="text-2xl font-bold mb-4">Thông báo</h2>
          <p className="mb-6 text-lg text-gray-600">{message}</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" // Thêm hiệu ứng focus
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }
  