import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import skyBg from '../assets/img/skybackground.jpg'
import room from '../assets/img/anh1.jpg'
import Notfication from '../components/Notification'
import ZaloChat from '../components/ZaloChat';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://xodhvzvlgwrzrdrnbzev.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGh2enZsZ3dyenJkcm5iemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjkyNTYsImV4cCI6MjA2NjkwNTI1Nn0.zNtwvH1fNH-hc6iCelhdOYgaANpnKaLjYK-OpNG4tqA'
)
function Home() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate(); // ✅ hook dùng để điều hướng
  const handleClick = () => {
    navigate('/branch'); // 👉 chuyển đến trang /about
  };
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage.from('image').list('content', { limit: 100 })
      if (!error && data) {
        const files = data.filter(f => f.name)
        const urls = files.map(f => ({
          name: f.name,
          url: supabase.storage.from('image').getPublicUrl(`content/${f.name}`).data.publicUrl
        }))
        setImageUrls(urls)
      } else {
        console.error("Lỗi khi lấy danh sách ảnh:", error)
      }
    }
    fetchImages()
  }, [])

  return (
    <>
      <div className="bg-mainColor min-h-screen">
        <Header></Header>
        {/* Hero section */}
        <div className="relative w-full h-[350px] md:h-[420px] overflow-hidden mt-10 flex items-center justify-center">
          <img src={skyBg} alt="Bầu trời" className="w-full h-full object-cover scale-y-[-1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-center drop-shadow-lg tracking-wide mb-4">
              Chào mừng đến <span className="text-blue-400">Tâm An</span> <br />
              <span className="text-lg md:text-2xl font-semibold">Nơi an cư, vững bước tương lai.</span>
            </h2>
            <button
              onClick={handleClick}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg rounded-full font-semibold text-lg hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
            >
              Khám khảo
            </button>
          </div>
        </div>
        <Notfication notfi="Giới thiệu"></Notfication>
        {/* Giới thiệu */}
        <section className="text-center">
          <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100">
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
                Nhà trọ <span className="text-blue-600 font-bold">Tâm An</span> tự hào mang đến một không gian sống hiện đại,
                an toàn, tiện nghi và đặc biệt là sự tự do tối đa. Chúng tôi hiểu rằng, một môi trường sống tốt không chỉ là
                nơi để ngả lưng mà còn là bệ phóng cho học tập và sự nghiệp của bạn.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 rounded-xl bg-blue-50 shadow hover:shadow-lg transition">
                  <div className="text-3xl font-bold text-blue-600">100+</div>
                  <div className="text-gray-600">Sinh viên tin tưởng</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-green-50 shadow hover:shadow-lg transition">
                  <div className="text-3xl font-bold text-green-600">24/7</div>
                  <div className="text-gray-600">Hỗ trợ an ninh</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-purple-50 shadow hover:shadow-lg transition">
                  <div className="text-3xl font-bold text-purple-600">5★</div>
                  <div className="text-gray-600">Đánh giá trung bình</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Notfication notfi="Tiện nghi"></Notfication>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-6 mb-10">
          <Amenities
            icon="wifi"
            title="Wifi tốc độ cao"
            message="Kết nối ổn định, hỗ trợ học tập và làm việc online hiệu quả."
          />
          <Amenities
            icon="camera"
            title="Camera an ninh"
            message="Hệ thống giám sát 24/7 đảm bảo an toàn tuyệt đối."
          />
          <Amenities
            icon="store"
            title="Tạp hóa & giặt ủi"
            message="Tiết kiệm thời gian, thuận tiện cho sinh hoạt hàng ngày."
          />
          <Amenities
            icon="pet"
            title="Nuôi thú cưng"
            message="Thoải mái sống cùng thú cưng mà không bị ràng buộc."
          />
          <Amenities
            icon="ac"
            title="Có điều hòa mát mẻ"
            message="Giữ cho căn phòng luôn dễ chịu, kể cả ngày hè oi bức."
          />
          <Amenities
            icon="clock"
            title="Tự do giờ giấc"
            message="Không giới hạn giờ giấc ra vào, phù hợp với sinh viên và người đi làm."
          />
        </div>
        <div className="text-darkblue text-center mt-10 text-2xl font-bold tracking-wide">
          Hình ảnh về nhà trọ
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-6 mb-16">
          {imageUrls.map((img, idx) => (
            <HouseImage key={idx} imgUrl={img.url} />
          ))}
        </div>
        <Footer></Footer>
        <ZaloChat
          oaid="1187923599968080778" // Thay thế bằng OA ID của bạn
          welcomeMessage="Rất vui khi được hỗ trợ bạn!"
          autopopup="0"
          width="350"
          height="420"
        />
      </div>
    </>
  )
}

// Amenities có icon
const amenityIcons = {
  wifi: (
    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2.05 7.05a16 16 0 0 1 19.9 0" /><path d="M5.5 10.5a11 11 0 0 1 13 0" /><path d="M8.5 13.5a6 6 0 0 1 7 0" /><circle cx="12" cy="17" r="1.5" /></svg>
  ),
  camera: (
    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="3" /><circle cx="12" cy="14" r="3.5" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
  ),
  store: (
    <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l1-5h16l1 5" /><path d="M5 22V12H19V22" /><rect x="7" y="16" width="2" height="6" /><rect x="15" y="16" width="2" height="6" /></svg>
  ),
  pet: (
    <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="4.5" cy="9.5" r="2.5" /><circle cx="19.5" cy="9.5" r="2.5" /><ellipse cx="12" cy="17" rx="7" ry="5" /><circle cx="12" cy="7" r="3" /></svg>
  ),
  ac: (
    <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="6" rx="2" /><path d="M7 19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2" /><path d="M12 11v6" /></svg>
  ),
  clock: (
    <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
  ),
};

function Amenities({ icon, title, message }) {
  return (
    <div className="bg-white text-black rounded-2xl p-6 flex flex-col items-center shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 border border-gray-100">
      <div className="mb-2">{amenityIcons[icon]}</div>
      <h1 className='text-xl font-semibold mb-1'>{title}</h1>
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
}

function HouseImage({ imgUrl }) {
  return (
    <div className="w-full flex justify-center items-center">
      <img
        src={imgUrl}
        alt="Hình nhà trọ"
        className="rounded-2xl w-full h-[320px] object-cover shadow-lg border border-gray-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
      />
    </div>
  );
}

export default Home
