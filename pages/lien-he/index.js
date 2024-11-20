// pages/Contact.js

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
        
        {/* Tiêu đề trang */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Liên hệ chúng tôi</h2>
        <p className="text-center text-gray-600 mb-10">Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua các phương thức dưới đây hoặc gửi tin nhắn trực tiếp!</p>

        {/* Thông tin liên hệ và bản đồ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Thông tin liên hệ */}
          <div className="flex flex-col space-y-4">
            {/* Phần địa chỉ */}
            <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-md">
              <FaMapMarkerAlt className="text-blue-500 text-2xl" />
              <div>
                <p className="text-lg font-semibold text-gray-700">Địa chỉ</p>
                <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
              </div>
            </div>

            {/* Phần điện thoại */}
            <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-md">
              <FaPhoneAlt className="text-blue-500 text-2xl" />
              <div>
                <p className="text-lg font-semibold text-gray-700">Điện thoại</p>
                <p className="text-gray-600">+84 123 456 789</p>
              </div>
            </div>

            {/* Phần email */}
            <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-md">
              <FaEnvelope className="text-blue-500 text-2xl" />
              <div>
                <p className="text-lg font-semibold text-gray-700">Email</p>
                <p className="text-gray-600">contact@company.com</p>
              </div>
            </div>
          </div>

          {/* Nhúng bản đồ Google Maps */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Địa điểm của chúng tôi</h3>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.377032453141!2d109.19130857489375!3d12.281388587974183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317067fa29cff007%3A0xd32fc9abe769472a!2zTmjDoCBTw6FjaCBUaGnDqm4gTMO9!5e1!3m2!1svi!2s!4v1730312408443!5m2!1svi!2s" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
            ></iframe>
          </div>
        </div>

        {/* Form liên hệ */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-gray-700 font-medium">Họ và tên</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Chủ đề</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập chủ đề liên hệ"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium">Tin nhắn</label>
            <textarea
              className="w-full h-32 px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tin nhắn của bạn"
            />
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Gửi tin nhắn
            </button>
          </div>
        </form>

        {/* Mạng xã hội */}
        <div className="flex justify-center space-x-6 mt-8">
          <a href="#" className="text-blue-500 text-2xl hover:text-blue-600">
            <FaFacebook />
          </a>
          <a href="#" className="text-blue-400 text-2xl hover:text-blue-500">
            <FaTwitter />
          </a>
          <a href="#" className="text-blue-600 text-2xl hover:text-blue-700">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
}
