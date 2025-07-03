import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../utils/supabaseClient'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Title from '../components/Title'
import AppButton from '../components/AppButton'


function BranchSelector() {
  const [branches, setBranches] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBranches = async () => {
      const { data, error } = await supabase.from('chi_nhanh').select('*')
      if (error) console.error('Lỗi Supabase:', error)
      else setBranches(data)
    }
    fetchBranches()
  }, [])

  const handleSelect = (branchId) => {
    navigate(`/booking/${branchId}`) // ✅ chuyển trang kèm ID chi nhánh
  }

  //hàm lấy url từ database
  const getImageUrl = (filename) => {
    return supabase
      .storage
      .from('lastfom') // ← Tên bucket
      .getPublicUrl(filename).data.publicUrl
  }
  return (
    <div>
      <br />
      <br />
      <br />
      <Header />
      <Title tieude="khu vực"></Title>
      <ul className=' grid grid-cols-1 md:grid-cols-3 gap-4'>
        {branches.map(branch => (
          <li
            key={branch.ma_chi_nhanh}
          >
            
            <div className="m-3">
              <img
                src={getImageUrl(branch.hinh_anh)}
                alt={branch.ten_chi_nhanh}
              />
              <div className="bg-info text-white text-[15px] px-3">
                <p className='font-bold'>{branch.ten_chi_nhanh}</p>
                điện: {branch.gia_dien}/kWh |
                nước: {branch.gia_nuoc}/m³
              </div>
              <AppButton onClick={() => handleSelect(branch.ma_chi_nhanh)}
               text ="Kham khảo"></AppButton>
            </div>
          </li>
        ))}
      </ul>
      <Footer />   
    </div>
  )
}

export default BranchSelector
