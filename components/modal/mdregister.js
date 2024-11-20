import { AiOutlineCheckCircle } from "react-icons/ai"; // Import icon dấu tích

const ModalRegister = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <AiOutlineCheckCircle className="text-green-500 text-3xl" /> {/* Dấu tích màu xanh */}
        <h3 className="text-xl font-semibold">{message}</h3>
      </div>
    </div>
  );
};

export default ModalRegister;
