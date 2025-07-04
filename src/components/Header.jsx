import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔴 PHẢI import

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // ✅ Hook dùng đúng chỗ

    // ✅ Hàm điều hướng
    function trans(page) {
        navigate(`/${page}`);
    }

    return (
        <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

                {/* Mobile toggle button */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                    </svg>
                </button>

                {/* Logo */}
                <a href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-lightblue">Tâm An</span>
                </a>

                {/* Nút Liên hệ Mobile */}
                <button
                    onClick={() => trans('lien-he')}
                    className="block md:hidden text-gray-700 hover:text-green-600 bg-btnContact p-2 rounded-2xl"
                >
                    Liên hệ
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <button onClick={() => trans('')} className="text-gray-700 hover:text-green-600 font-medium">Trang chủ</button>
                    <button onClick={() => trans('Branch')} className="text-gray-700 hover:text-green-600 font-medium">Phòng</button>
                    <button onClick={() => trans('lien-he')} className="text-gray-700 hover:text-green-600 font-medium">Liên hệ</button>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <nav className="md:hidden bg-white px-4 pb-4 space-y-2">
                    <button onClick={() => trans('')} className="block text-gray-700 hover:text-green-600">Trang chủ</button>
                    <button onClick={() => trans('Branch')} className="block text-gray-700 hover:text-green-600">Phòng</button>
                    <button onClick={() => trans('lien-he')} className="block text-gray-700 hover:text-green-600 ">Liên hệ</button>
                </nav>
            )}
        </header>
    );
}
