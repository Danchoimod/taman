import React, { useState } from 'react';
// md:block	Hiện (display: block) từ 768px trở lên
//hidden là mọi màn hình 
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* mobile button */}

                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                    </svg>
                </button>

                {/* logo */}
                <a href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-lightblue">Tâm An</span>
                </a>
                <a
                    href="/lien-he"
                    className="block md:hidden text-gray-700 hover:text-green-600 bg-btnContact p-2 rounded-2xl"
                >
                    Liên hệ
                </a>

                {/* Desktop Nav */}

                <nav className="hidden md:flex space-x-6">
                    <a href="/" className="text-gray-700 hover:text-green-600 font-medium">Trang chủ</a>
                    <a href="/phong" className="text-gray-700 hover:text-green-600 font-medium">Phòng</a>
                    <a href="/lien-he" className="text-gray-700 hover:text-green-600 font-medium">Liên hệ</a>
                </nav>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <nav className="md:hidden bg-white px-4 pb-4 space-y-2 ">
                    <a href="/" className="block text-gray-700 hover:text-green-600">Trang chủ</a>
                    <a href="/phong" className="block text-gray-700 hover:text-green-600">Phòng</a>
                    <a href="/lien-he" className="block text-gray-700 hover:text-green-600">Liên hệ</a>

                </nav>
            )}
        </header>
    );
}
