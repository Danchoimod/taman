import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from '../utils/supabaseClient'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Title from '../components/Title'
import AppButton from '../components/AppButton'
import zaloIcon from '../assets/img/zalo-icon.png'

function RoomBooking() {
  const { branchId } = useParams()
  const [branch, setBranch] = useState(null)
  const [rooms, setRooms] = useState([])
  // Lấy thông tin chi nhánh
  useEffect(() => {
    const fetchBranch = async () => {
      const { data, error } = await supabase
        .from('chi_nhanh')
        .select('*')
        .eq('ma_chi_nhanh', branchId)
        .single()

      if (error) console.error('Lỗi lấy chi nhánh:', error)
      else setBranch(data)
    }
    fetchBranch()
  }, [branchId])

  // Lấy danh sách phòng thuộc chi nhánh
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('phong')
        .select('*')
        .eq('ma_chi_nhanh', branchId)

      if (error) console.error('Lỗi lấy phòng:', error)
      else setRooms(data)
    }
    fetchRooms()
  }, [branchId])
  const getImageUrl = (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return supabase
      .storage
      .from('image')
      .getPublicUrl(filename).data.publicUrl;
  }
  if (!branch) return <p>Đang tải chi nhánh...</p>

  return (
    <div className="min-h-screen bg-mainColor">
      <Header />
      <div className="pt-16 pb-4">
        <Title tieude={branch.ten_chi_nhanh} />
        {rooms.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">Không có phòng nào trong chi nhánh này.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
            {rooms.filter(room => room.dang_trong).map(room => (
              <li key={room.ma_phong}>
                <div className="bg-white rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition p-4 flex flex-col items-center h-full">
                  <img
                    src={getImageUrl(room.hinh_anh)}
                    alt={room.ten_phong}
                    className="rounded-2xl w-full h-[200px] object-cover mb-4 border border-gray-100 shadow-sm"
                  />
                  <div className="w-full text-center mb-3">
                    <p className="font-bold text-lg mb-1 text-blue-900">{room.ten_phong}</p>
                    <span className="text-base font-semibold text-blue-600">Giá: {room.gia_phong.toLocaleString()}đ</span>
                    <span className={`block text-sm mt-1 font-medium ${room.dang_trong ? 'text-green-600' : 'text-gray-400'}`}>
                      {room.dang_trong ? 'Trống' : 'Đã thuê'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold shadow text-base border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-100"
                    onClick={() => window.open('https://zalo.me/0913778270', '_blank')}
                  >
                    <img src={zaloIcon} alt="Zalo" className="w-5 h-5 mr-1" />
                    Liên hệ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default RoomBooking
