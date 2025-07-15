import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from '../utils/supabaseClient'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Title from '../components/Title'
import AppButton from '../components/AppButton'

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
            {rooms.map(room => (
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
                    <span className="block text-sm mt-1 font-medium {room.dang_trong ? 'text-green-600' : 'text-gray-400'}">
                      {room.dang_trong ? 'Trống' : 'Đã thuê'}
                    </span>
                  </div>
                  <AppButton
                    text="Thuê"
                    className="w-full mt-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
                  />
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
