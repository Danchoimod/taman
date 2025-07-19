import React from 'react';
import ZaloConsentWidget from '../components/ZaloConsentWidget';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LienHe() {
  return (
    <div className="min-h-screen bg-mainColor flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 max-w-xl w-full mx-auto p-8 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">Liên hệ</h1>
          <p className="text-gray-700 text-center mb-6">Chúng tôi luôn sẵn sàng hỗ trợ bạn! Hãy liên hệ với Tâm An qua các kênh dưới đây:</p>
          <div className="w-full flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3 text-lg">
              <span className="text-blue-500 text-2xl">📞</span>
              <span className="font-semibold">Điện thoại:</span>
              <a href="tel:0913778270" className="text-blue-700 hover:underline">0913778270</a>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <span className="text-green-600 text-2xl">✉️</span>
              <span className="font-semibold">Email:</span>
              <a href="mailto:tamantro@gmail.com" className="text-blue-700 hover:underline">tamantro@gmail.com</a>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <span className="text-purple-600 text-2xl">📍</span>
              <span className="font-semibold">Địa chỉ:</span>
              <span>Trọ Tâm An 2, KDC Đại Lộc Phát, phường Long Tuyền, Bình Thủy, TP Cần Thơ</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <span className="text-blue-400 text-2xl">💬</span>
              <span className="font-semibold">Zalo:</span>
              <a href="https://zalo.me/0913778270" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">0913778270</a>
            </div>
          </div>
          <div className="w-full bg-blue-50 rounded-xl p-4 flex flex-col items-center mb-2">
            <p className="text-blue-800 font-semibold mb-2 text-center">Hoặc chat trực tiếp với chúng tôi qua Zalo:</p>
            <ZaloConsentWidget />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
