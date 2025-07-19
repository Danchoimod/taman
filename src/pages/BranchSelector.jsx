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
  const getImageUrl = (hinh_anh) => {
    if (!hinh_anh) return '';
    // Nếu đã là public URL thì trả về luôn
    if (hinh_anh.startsWith('http')) return hinh_anh;
    // Nếu chỉ lưu tên file, lấy từ bucket image/branch/
    return supabase
      .storage
      .from('image')
      .getPublicUrl(`branch/${hinh_anh}`).data.publicUrl;
  }
  return (
    <div className="min-h-screen bg-mainColor">
      <Header />
      <div className="pt-16 pb-4">
        <Title tieude="Khu vực" />
        <div className="max-w-6xl mx-auto">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {branches.map(branch => (
              <li key={branch.ma_chi_nhanh}>
                <div
                  className="bg-white rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl hover:border-blue-400 hover:scale-[1.03] transition-all duration-200 p-4 flex flex-col items-center h-full cursor-pointer"
                  onClick={() => handleSelect(branch.ma_chi_nhanh)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(branch.ma_chi_nhanh); }}
                >
                  <img
                    src={getImageUrl(branch.hinh_anh)}
                    alt={branch.ten_chi_nhanh}
                    className="rounded-2xl w-full h-[200px] object-cover mb-4 border border-gray-100 shadow-sm"
                  />
                  <div className="bg-blue-50 text-blue-900 text-[16px] px-4 py-2 rounded-xl w-full text-center font-semibold mb-3">
                    <p className='font-bold text-lg mb-1'>{branch.ten_chi_nhanh}</p>
                    <span className="text-sm font-normal">Điện: <span className="font-bold text-blue-600">{branch.gia_dien}</span>/kWh &nbsp;|&nbsp; Nước: <span className="font-bold text-blue-600">{branch.gia_nuoc}</span>/m³</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BranchSelector
