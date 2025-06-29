import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/Zalo'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-mainColor">
        <Header></Header>
        <br /><br />
        {/* đây là content  */}
        <div className="relative w-full h-64 overflow-hidden">
          {/* ảnh nền */}
          <img src="\img\skybackground.jpg" alt="Bầu trời" className="w-full h-full object-cover scale-y-[-1]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold text-center">Chào mừng đến Tâm An <br /> Nơi an cư, vững bước tương lai.</h2>
            <button className="mt-4 px-4 py-2 bg-btnContact text-black transition-transform duration-300 hover:scale-105">Kham khảo</button>
          </div>

        </div>
                <Notfication notfi="Giới thiệu"></Notfication>
        <div className="text-center text-darkblue text-lg font-semibold px-4 py-6 px-8 mx-auto bg-btnContact w-full">
          Nhà trọ Tâm An tự hào mang đến một không gian sống hiện đại, an toàn, tiện nghi và đặc biệt là sự tự do tối đa, biến nơi đây thành lựa 
          chọn hoàn hảo cho cả sinh viên Đại học FPT và những người trẻ đang trong giai đoạn khởi nghiệp hoặc đã đi làm tại Cần Thơ. Chúng tôi hiểu 
          rằng, một môi trường sống tốt không chỉ là nơi để ngả lưng mà còn là bệ phóng cho học tập và sự nghiệp.
        </div>

        <Notfication notfi="Tiện nghi"></Notfication>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            title="Chỗ để xe an toàn"
            message="Tự do ra vào, phù hợp với lịch sinh hoạt linh hoạt."
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
        <HouseImage imgUrl="img/anh1.jpg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HouseImage imgUrl="img/anh1.jpg" />
          <HouseImage imgUrl="img/anh1.jpg" />

        </div>
        {/* đây là content  */}

        <Footer></Footer>
        <ZaloFloat></ZaloFloat>
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
function Notfication({notfi}){
  return(
 <div className='bg-notfi text-white font-bold text-2xl mx-5 mt-5 rounded-xl p-2 text-center'>{notfi}</div>
  );
}


export default App
