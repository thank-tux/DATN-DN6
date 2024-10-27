// components/Loading.js
export default function Loading() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          <div className="w-8 h-8 bg-red-500 rounded-full"></div>
        </div>
        <p className="mt-4 text-lg text-gray-600">Đang tải...</p> {/* Thêm chữ */}
      </div>
    );
  }
  