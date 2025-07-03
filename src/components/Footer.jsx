import React from 'react'

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Liên hệ</h3>
            <p className="text-gray-300">📞 0913778270</p>
            <p className="text-gray-300">Zalo: Nhà trọ Tâm An</p>

          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Địa chỉ</h3>
            <p className="text-gray-300">Trọ Tâm An 2, KDC Đại Lộc Phát, phường Long Tuyền, Bình Thủy</p>
            <p className="text-gray-300">Thành phố Cần Thơ</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Theo dõi</h3>
            <p className="text-gray-300">Facebook | Zalo</p>
            <p className="text-gray-300">Instagram | TikTok</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4">
          <p>&copy; 2024 Nhà trọ Tâm An. Thiết kế bởi LastFom Studio</p>
          <p className="text-gray-300">📧 Lastfom.studio@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default Footer