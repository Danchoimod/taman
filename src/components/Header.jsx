import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    function trans(page) {
        navigate(`/${page}`);
    }

    return (
        <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Mobile toggle button */}
                <button
                    className="md:hidden text-gray-700 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                    </svg>
                </button>

                {/* Logo */}
                <a href="/" className="flex items-center space-x-2 select-none">
                    <span className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-wide drop-shadow-sm"> Tâm An</span>
                </a>

                {/* Nút Liên hệ Mobile */}
                <button
                    onClick={() => trans('lien-he')}
                    className="block md:hidden bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
                >
                    Liên hệ
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
                    <button onClick={() => trans('')} className="px-4 py-2 rounded-full text-gray-700 font-semibold hover:bg-blue-50 hover:text-blue-700 transition">Trang chủ</button>
                    <button onClick={() => trans('Branch')} className="px-4 py-2 rounded-full text-gray-700 font-semibold hover:bg-blue-50 hover:text-blue-700 transition">Phòng</button>
                    <button onClick={() => trans('lien-he')} className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-300">Liên hệ</button>
                    <button onClick={() => trans('auth')} className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow hover:from-green-500 hover:to-green-700 transition-all duration-300">Đăng nhập</button>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <nav className="md:hidden bg-white px-4 pb-6 pt-2 space-y-3 shadow-lg rounded-b-2xl animate-fade-in-down">
                    <button onClick={() => { setIsOpen(false); trans(''); }} className="block w-full text-left px-4 py-3 rounded-full text-gray-700 font-semibold hover:bg-blue-50 hover:text-blue-700 transition">Trang chủ</button>
                    <button onClick={() => { setIsOpen(false); trans('Branch'); }} className="block w-full text-left px-4 py-3 rounded-full text-gray-700 font-semibold hover:bg-blue-50 hover:text-blue-700 transition">Phòng</button>
                    <button onClick={() => { setIsOpen(false); trans('lien-he'); }} className="block w-full text-left px-4 py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-300">Liên hệ</button>
                    <button onClick={() => { setIsOpen(false); trans('auth'); }} className="block w-full text-left px-4 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow hover:from-green-500 hover:to-green-700 transition-all duration-300">Đăng nhập</button>
                </nav>
            )}
        </header>
    );
}
