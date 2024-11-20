// pages/About.js

import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row">
        
        {/* Nội dung giới thiệu */}
        <div className="md:w-2/3 pr-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Giới thiệu về Nhà sách Thiên Lý</h2>

          <p className="text-lg text-gray-700 mb-4">
            Chào mừng bạn đến với <span className="font-semibold">Nhà sách Thiên Lý</span>, nơi cung cấp cho bạn những cuốn sách tuyệt vời nhất!
            Chúng tôi cam kết mang đến cho bạn một trải nghiệm mua sắm trực tuyến dễ dàng và thú vị.
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Về chúng tôi</h3>
          <p className="text-lg text-gray-700 mb-4">
            Nhà sách Thiên Lý được thành lập với sứ mệnh kết nối độc giả với những tác phẩm văn học đa dạng, từ sách giáo khoa, tiểu thuyết, đến sách kỹ năng và tự lực. 
            Chúng tôi tin rằng mỗi cuốn sách đều có sức mạnh để thay đổi cuộc sống và khơi dậy trí tưởng tượng của bạn.
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Tại sao chọn Nhà sách Thiên Lý?</h3>
          <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
            <li>Các đầu sách phong phú và đa dạng</li>
            <li>Giá cả hợp lý và các chương trình khuyến mãi hấp dẫn</li>
            <li>Giao hàng nhanh chóng và tiện lợi</li>
            <li>Dịch vụ chăm sóc khách hàng tận tình và chu đáo</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Liên hệ với chúng tôi</h3>
          <p className="text-lg text-gray-700 mb-4">
            Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, hãy liên hệ với chúng tôi qua email: 
            <a href="mailto:contact@nhasachthienly.com" className="text-blue-500"> contact@nhasachthienly.com</a>.
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Theo dõi chúng tôi trên mạng xã hội</h3>
          <div className="flex justify-start space-x-4 mt-4">
            <a href="#" className="text-blue-600 hover:text-blue-700">
              <FaFacebook />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-500">
              <FaTwitter />
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-800">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Ảnh logo hoặc banner */}
        <div className="md:w-1/3 flex justify-center">
          <img 
            src="https://img.upanh.tv/2024/10/25/author-1.png" // Đường dẫn tới ảnh logo (đảm bảo ảnh tồn tại trong thư mục public)
            alt="Nhà sách Thiên Lý"
            className="h-48 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
