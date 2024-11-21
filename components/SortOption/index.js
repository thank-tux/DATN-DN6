import React from "react";
import { PiSortAscendingBold } from "react-icons/pi";

const SortOptions = ({ sortOption, setSortOption }) => {
    return (
        <div className="flex items-center justify-end mb-6 space-x-4"> 
            <span className="flex items-center text-gray-700 font-medium">
                <PiSortAscendingBold className="mr-2 text-lg" /> Sắp xếp theo:
            </span>
            <button
                onClick={() => setSortOption("default")}
                className={`px-4 py-2 rounded border ${sortOption === "default" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
                Mặc định
            </button>
            <button
                onClick={() => setSortOption("newest")}
                className={`px-4 py-2 rounded border ${sortOption === "newest" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
                Sách mới
            </button>
            <button
                onClick={() => setSortOption("price-low-high")}
                className={`px-4 py-2 rounded border ${sortOption === "price-low-high" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
                Giá thấp - cao
            </button>
            <button
                onClick={() => setSortOption("price-high-low")}
                className={`px-4 py-2 rounded border ${sortOption === "price-high-low" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
                Giá cao - thấp
            </button>
        </div>

    );

};

export default SortOptions;
