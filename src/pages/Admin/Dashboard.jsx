import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Khởi tạo Supabase client
const supabase = createClient(
  'https://xodhvzvlgwrzrdrnbzev.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGh2enZsZ3dyenJkcm5iemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjkyNTYsImV4cCI6MjA2NjkwNTI1Nn0.zNtwvH1fNH-hc6iCelhdOYgaANpnKaLjYK-OpNG4tqA'
)

const Dashboard = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [roomCount, setRoomCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);
  const [branchCount, setBranchCount] = useState(0);
  const [emptyRoomCount, setEmptyRoomCount] = useState(0);
  const [folder, setFolder] = useState('content');
  const [customFolder, setCustomFolder] = useState('');

  // Hàm tải danh sách ảnh từ bucket 'image' trong folder đang chọn
  const fetchImages = async (targetFolder = folder) => {
    setLoading(true)
    const { data, error } = await supabase.storage.from('image').list(targetFolder, { limit: 100 })
    if (!error && data) {
      const files = data.filter(f => f.name)
      const urls = files.map(f => ({
        name: f.name,
        url: supabase.storage.from('image').getPublicUrl(`${targetFolder}/${f.name}`).data.publicUrl
      }))
      setImages(urls)
    } else {
      setImages([])
      if (error) console.error('Lỗi load ảnh:', error)
    }
    setLoading(false)
  }

  // Hàm lấy thống kê số lượng phòng, hợp đồng, chi nhánh
  const fetchStats = async () => {
    const [
      { count: phongCount },
      { count: hopDongCount },
      { count: chiNhanhCount },
      { count: emptyCount }
    ] = await Promise.all([
      supabase.from('phong').select('*', { count: 'exact', head: true }),
      supabase.from('hop_dong').select('*', { count: 'exact', head: true }),
      supabase.from('chi_nhanh').select('*', { count: 'exact', head: true }),
      supabase.from('phong').select('*', { count: 'exact', head: true }).eq('dang_trong', true)
    ]);
    setRoomCount(phongCount || 0);
    setContractCount(hopDongCount || 0);
    setBranchCount(chiNhanhCount || 0);
    setEmptyRoomCount(emptyCount || 0);
  };

  useEffect(() => {
    fetchImages(folder)
    fetchStats()
  }, [folder])

  // Upload ảnh vào image/[folder]
  const handleAddImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)

    const cleanName = file.name
      .normalize('NFD').replace(/[^\x00-\x7F]/g, '') // Bỏ dấu
      .replace(/\s+/g, '_') // Thay khoảng trắng bằng _
    const fileName = `${uuidv4()}_${cleanName}`

    const { error: uploadError } = await supabase.storage
      .from('image')
      .upload(`${folder}/${fileName}`, file)

    if (uploadError) {
      alert('Lỗi upload ảnh: ' + uploadError.message)
      console.error('Upload error:', uploadError)
      setLoading(false)
      return
    }

    await fetchImages(folder)
    setLoading(false)
  }

  // Xoá ảnh trong image/[folder]
  const handleDeleteImage = async (idx) => {
    const img = images[idx]
    setLoading(true)

    const { error } = await supabase.storage
      .from('image')
      .remove([`${folder}/${img.name}`])

    if (error) {
      alert('Lỗi xoá ảnh: ' + error.message)
      console.error('Delete error:', error)
    } else {
      await fetchImages(folder)
    }

    setLoading(false)
  }

  const iconStats = [
    <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h18M3 6h18M3 14h18M3 18h18" /></svg>,
    <svg className="w-8 h-8 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>,
    <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>,
    <svg className="w-8 h-8 text-orange-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>,
  ];
  const statTitles = ["Phòng", "Hợp đồng", "Chi nhánh", "Phòng trống"];
  const statColors = ["blue", "green", "purple", "orange"];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <a href="/" className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-150">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          Về màn hình chính
        </a>
        <span className="text-2xl font-bold text-gray-700 flex items-center ml-4">
          <svg className="w-8 h-8 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
          Dashboard Quản trị
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[roomCount, contractCount, branchCount, emptyRoomCount].map((count, idx) => (
          <div key={idx} className={`bg-${statColors[idx]}-50 rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition-transform duration-200 border-t-4 border-${statColors[idx]}-400`}>
            {iconStats[idx]}
            <div className={`text-3xl font-extrabold text-${statColors[idx]}-600 mb-1`}>{count}</div>
            <div className="text-gray-600 text-lg font-semibold">{statTitles[idx]}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center mb-4 gap-4">
        <svg className="w-7 h-7 text-pink-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
        <p className="font-bold text-xl text-gray-800">Quản lý hình ảnh (bucket: image / thư mục: <span className='text-blue-600'>{folder}</span>)</p>
        <select
          className="ml-4 border rounded px-2 py-1"
          value={['content','branch','room-images'].includes(folder) ? folder : 'custom'}
          onChange={e => {
            if (e.target.value === 'custom') {
              setFolder(customFolder || '')
            } else {
              setFolder(e.target.value)
            }
          }}
        >
          <option value="content">content</option>
          <option value="branch">branch</option>
          <option value="room-images">room-images</option>
          <option value="custom">Khác...</option>
        </select>
        {(['content','branch','room-images'].includes(folder) ? false : true) && (
          <input
            className="ml-2 border rounded px-2 py-1"
            placeholder="Nhập tên thư mục"
            value={customFolder}
            onChange={e => {
              setCustomFolder(e.target.value)
              setFolder(e.target.value)
            }}
            style={{width: 140}}
          />
        )}
      </div>
      <form onSubmit={e => e.preventDefault()} className="flex items-center gap-3 mb-6">
        <input
          type="file"
          accept="image/*"
          id="upload-image"
          onChange={handleAddImage}
          className="hidden"
          disabled={loading}
        />
        <button
          type="button"
          className="flex items-center bg-gradient-to-r from-blue-500 to-blue-400 text-white px-5 py-2 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all font-semibold text-lg"
          disabled={loading}
          onClick={() => document.getElementById('upload-image').click()}
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
          {loading ? 'Đang xử lý...' : 'Tải lên ảnh'}
        </button>
        {loading && <span className="ml-2 animate-spin"><svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" /><path className="opacity-75" d="M4 12a8 8 0 018-8v8z" /></svg></span>}
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img, idx) => (
          <div key={img.name} className="relative border rounded-2xl shadow-lg overflow-hidden group">
            <img src={img.url} alt={img.name} className="rounded-2xl w-full h-[400px] object-cover group-hover:brightness-75 transition-all duration-200" />
            <button
              onClick={() => handleDeleteImage(idx)}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all text-xl"
              title="Xoá ảnh"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 text-white text-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-all">{img.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
