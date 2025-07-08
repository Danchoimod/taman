import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import skyBg from '../assets/img/skybackground.jpg'
import room from '../assets/img/anh1.jpg'
import Notfication from '../components/Notification'
import ZaloChat from '../components/ZaloChat';

function Home() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate(); // ✅ hook dùng để điều hướng
  const handleClick = () => {
    navigate('/branch'); // 👉 chuyển đến trang /about

  };
  return (
    <>
      <div className="bg-mainColor">
        <Header></Header>

        {/* đây là content  */}
        <div className="relative w-full h-64 overflow-hidden mt-10">
          {/* ảnh nền */}
          <img src={skyBg} alt="Bầu trời" className="w-full h-full object-cover scale-y-[-1]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold text-center">Chào mừng đến Tâm An <br /> Nơi an cư, vững bước tương lai.</h2>
            <button onClick={handleClick} className="mt-4 px-4 py-2 bg-btnContact text-black transition-transform duration-300 hover:scale-105 rounded-2xl font-semibold">Kham khảo</button>
          </div>

        </div>
        <Notfication notfi="Giới thiệu"></Notfication>

        <section className="text-center">

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
                Nhà trọ <span className="text-blue-600 font-bold">Tâm An</span> tự hào mang đến một không gian sống hiện đại,
                an toàn, tiện nghi và đặc biệt là sự tự do tối đa. Chúng tôi hiểu rằng, một môi trường sống tốt không chỉ là
                nơi để ngả lưng mà còn là bệ phóng cho học tập và sự nghiệp của bạn.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-blue-600">100+</div>
                  <div className="text-gray-600">Sinh viên tin tưởng</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-green-600">24/7</div>
                  <div className="text-gray-600">Hỗ trợ an ninh</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-600">5★</div>
                  <div className="text-gray-600">Đánh giá trung bình</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Notfication notfi="Tiện nghi"></Notfication>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Amenities
            title="Wifi tốc độ cao"
            message="Kết nối ổn định, hỗ trợ học tập và làm việc online hiệu quả."
          />
          <Amenities
            title="Camera an ninh"
            message="Hệ thống giám sát 24/7 đảm bảo an toàn tuyệt đối."
          />
          <Amenities
            title="Tạp hóa và giặc ủi trong trọ"
            message="Tiết kiệm thời gian, thuận tiện cho sinh hoạt hàng ngày."
          />
          <Amenities
            title="Cho phép nuôi thú cưng"
            message="Thoải mái sống cùng thú cưng mà không bị ràng buộc."
          />

          <Amenities
            title="Có điều hòa mát mẻ"
            message="Giữ cho căn phòng luôn dễ chịu, kể cả ngày hè oi bức."
          />

          <Amenities
            title="Tự do giờ giấc"
            message="Không giới hạn giờ giấc ra vào, phù hợp với sinh viên và người đi làm."
          />

        </div>

        <div className="text-darkblue text-center mt-10 text-xl font-bold">
          Hình ảnh về nhà trọ
        </div>
        <HouseImage imgUrl={room} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HouseImage imgUrl={room} />
          <HouseImage imgUrl={room} />

        </div>
        {/* đây là content  */}

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
function Amenities({ title, message }) {
  return (
    <div className="bg-white text-black mx-5 mt-5 rounded-xl p-2 transition-transform duration-300 hover:scale-105" >
      <h1 className='text-xl font-medium'>{title}</h1>
      <p>{message}</p>
    </div>
  );
}
function HouseImage({ imgUrl }) {
  return (
    <div className="w-full h-auto  p-10 justify-center justify-items-center">
      <img src={imgUrl} alt="Hình nhà trọ" className='rounded-xl Header' />
    </div>
  );
}



export default Home
