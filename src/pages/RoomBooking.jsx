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
    } // giá trị trong useeffect sẽ thay đổi theo giá trị được thay đổi

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
    return supabase
      .storage
      .from('lastfom') // ← Tên bucket
      .getPublicUrl(filename).data.publicUrl
  }
  if (!branch) return <p>Đang tải chi nhánh...</p>

  return (
    <div>
      <br />
      <br />
      <br />
      <Header></Header>

      <Title tieude={branch.ten_chi_nhanh}></Title>
      {rooms.length === 0 ? (
        <p>Không có phòng nào trong chi nhánh này.</p>
      ) : (
        <ul className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {rooms.map(room => (
            <li key={room.ma_phong}>
              <div className="m-5">
                <img src={getImageUrl("image3.png")} alt="" />
                <strong>{room.ten_phong}</strong> – Giá: {room.gia_phong} –{' '}
                {room.dang_trong ? 'Trống' : 'Đã thuê'}
                <AppButton text="Thuê"></AppButton>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Footer></Footer>
    </div>
  )
}

export default RoomBooking
