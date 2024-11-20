// components/Modal.js
import React from 'react';

const LoginModal = ({ title, message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p>{message}</p>
                <button 
                    onClick={onClose} 
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
