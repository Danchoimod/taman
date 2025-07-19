import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Electrical() {
  const [entries, setEntries] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [form, setForm] = useState({
    ma_so: '', // dùng cho update
    thang: '',
    nam: '',
    so_dien: '',
    so_nuoc: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [exportMonth, setExportMonth] = useState('')
  const [exportYear, setExportYear] = useState('')
  const [batchResult, setBatchResult] = useState([])
  const [branchFilter, setBranchFilter] = useState('');
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchRooms()
    fetchEntries()
    fetchBranches();
  }, [])

  const fetchRooms = async () => {
    const { data, error } = await supabase.from('phong').select('ma_phong, ten_phong, ma_chi_nhanh')
    if (!error && data) setRooms(data)
  }

  const fetchEntries = async () => {
    const { data, error } = await supabase.from('so_dien_nuoc').select('*')
    if (error) {
      console.error('Lỗi khi lấy dữ liệu:', error.message)
    } else {
      setEntries(data)
    }
  }

  const fetchBranches = async () => {
    const { data, error } = await supabase.from('chi_nhanh').select('ma_chi_nhanh, ten_chi_nhanh');
    if (!error && data) setBranches(data);
  };

  // Lọc entries theo phòng đang chọn
  const filteredEntries = selectedRoom
    ? entries.filter(e => e.ma_phong === selectedRoom.ma_phong)
    : []

  // Lọc phòng theo chi nhánh
  const filteredRooms = branchFilter ? rooms.filter(r => r.ma_chi_nhanh === branchFilter) : rooms;

  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
    setForm({ ma_so: '', thang: '', nam: '', so_dien: '', so_nuoc: '' })
    setIsEditing(false)
  }

  const handleBack = () => {
    setSelectedRoom(null)
    setForm({ ma_so: '', thang: '', nam: '', so_dien: '', so_nuoc: '' })
    setIsEditing(false)
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddOrUpdate = async () => {
    if (!form.thang || !form.nam || !form.so_dien || !form.so_nuoc) {
      alert('Vui lòng nhập đầy đủ thông tin!')
      return
    }
    if (!selectedRoom) return

    if (isEditing && form.ma_so) {
      // Update
      const { error } = await supabase
        .from('so_dien_nuoc')
        .update({
          thang: Number(form.thang),
          nam: Number(form.nam),
          so_dien: Number(form.so_dien),
          so_nuoc: Number(form.so_nuoc),
        })
        .eq('ma_so', form.ma_so)
      if (error) {
        console.error('Lỗi cập nhật:', error.message)
      } else {
        fetchEntries()
        setForm({ ma_so: '', thang: '', nam: '', so_dien: '', so_nuoc: '' })
        setIsEditing(false)
      }
    } else {
      // Thêm mới, kiểm tra trùng tháng/năm/phòng
      const exists = entries.find(
        e => e.ma_phong === selectedRoom.ma_phong && e.thang === Number(form.thang) && e.nam === Number(form.nam)
      )
      if (exists) {
        alert('Đã có chỉ số cho phòng này vào tháng/năm này!')
      return
    }
    const newEntry = {
      ma_so: uuidv4(),
        ma_phong: selectedRoom.ma_phong,
      thang: Number(form.thang),
      nam: Number(form.nam),
      so_dien: Number(form.so_dien),
      so_nuoc: Number(form.so_nuoc),
    }
    const { error } = await supabase.from('so_dien_nuoc').insert([newEntry])
    if (error) {
      console.error('Lỗi thêm dữ liệu:', error.message)
    } else {
      fetchEntries()
        setForm({ ma_so: '', thang: '', nam: '', so_dien: '', so_nuoc: '' })
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá chỉ số này?')) return
    const { error } = await supabase
      .from('so_dien_nuoc')
      .delete()
      .eq('ma_so', id)
    if (error) {
      console.error('Lỗi xoá:', error.message)
    } else {
      fetchEntries()
    }
  }

  const handleEdit = (entry) => {
    setForm({
      ma_so: entry.ma_so,
      thang: entry.thang,
      nam: entry.nam,
      so_dien: entry.so_dien,
      so_nuoc: entry.so_nuoc,
    })
    setIsEditing(true)
  }

  // Hàm xuất hóa đơn hàng loạt
  const handleBatchExport = () => {
    if (!exportMonth || !exportYear) {
      alert('Vui lòng nhập tháng/năm muốn xuất hóa đơn!')
      return
    }
    // Lấy tất cả phòng có chỉ số tháng/năm này
    const month = Number(exportMonth)
    const year = Number(exportYear)
    const result = rooms.map(room => {
      // Chỉ số mới
      const moi = entries.find(e => e.ma_phong === room.ma_phong && e.thang === month && e.nam === year)
      // Chỉ số cũ: tháng trước, nếu tháng=1 thì lùi về tháng 12 năm trước
      let prevMonth = month - 1
      let prevYear = year
      if (prevMonth === 0) {
        prevMonth = 12
        prevYear = year - 1
      }
      const cu = entries.find(e => e.ma_phong === room.ma_phong && e.thang === prevMonth && e.nam === prevYear)
      return {
        ten_phong: room.ten_phong,
        ma_phong: room.ma_phong,
        thang: month,
        nam: year,
        so_dien_moi: moi ? moi.so_dien : null,
        so_dien_cu: cu ? cu.so_dien : null,
        so_nuoc_moi: moi ? moi.so_nuoc : null,
        so_nuoc_cu: cu ? cu.so_nuoc : null,
        dien_tieu_thu: moi && cu ? moi.so_dien - cu.so_dien : null,
        nuoc_tieu_thu: moi && cu ? moi.so_nuoc - cu.so_nuoc : null,
        missing: !moi
      }
    })
    setBatchResult(result)
  }

  // --- UI ---
  return (
    <div className='p-8 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Quản lý chỉ số điện nước</h1>
      {/* Combobox lọc chi nhánh */}
      <div className='mb-6 flex gap-4 items-center'>
        <label className='font-semibold'>Lọc theo chi nhánh:</label>
        <select
          className='p-2 border rounded min-w-[200px]'
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
        >
          <option value=''>Tất cả chi nhánh</option>
          {branches.map(b => (
            <option key={b.ma_chi_nhanh} value={b.ma_chi_nhanh}>{b.ten_chi_nhanh}</option>
          ))}
        </select>
      </div>
      {/* Xuất hóa đơn hàng loạt */}
      <div className='mb-8 flex flex-wrap gap-4 items-end bg-blue-50 p-4 rounded-xl shadow'>
        <div>
          <label className='block font-semibold mb-1'>Tháng muốn xuất hóa đơn</label>
          <input type='number' min='1' max='12' value={exportMonth} onChange={e => setExportMonth(e.target.value)} className='p-2 border rounded w-24' placeholder='Tháng' />
        </div>
        <div>
          <label className='block font-semibold mb-1'>Năm muốn xuất hóa đơn</label>
          <input type='number' min='2000' value={exportYear} onChange={e => setExportYear(e.target.value)} className='p-2 border rounded w-32' placeholder='Năm' />
        </div>
        <button
          className='px-4 py-2 rounded bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-300'
          onClick={handleBatchExport}
        >
          Xuất hóa đơn hàng loạt
        </button>
      </div>
      {batchResult.length > 0 && (
        <div className='mb-8 overflow-x-auto'>
          <h2 className='text-lg font-bold mb-2'>Kết quả xuất hóa đơn tháng {exportMonth}/{exportYear}</h2>
          <table className='min-w-full border text-center bg-white rounded-xl shadow'>
            <thead>
              <tr className='bg-blue-100'>
                <th className='border px-2 py-1'>Phòng</th>
                <th className='border px-2 py-1'>Tháng/Năm</th>
                <th className='border px-2 py-1'>Điện cũ</th>
                <th className='border px-2 py-1'>Điện mới</th>
                <th className='border px-2 py-1'>Tiêu thụ điện</th>
                <th className='border px-2 py-1'>Nước cũ</th>
                <th className='border px-2 py-1'>Nước mới</th>
                <th className='border px-2 py-1'>Tiêu thụ nước</th>
              </tr>
            </thead>
            <tbody>
              {batchResult.map((r, idx) => (
                <tr key={r.ma_phong} className={r.missing ? 'bg-red-100' : 'hover:bg-blue-50'}>
                  <td className='border px-2 py-1 font-semibold'>{r.ten_phong}</td>
                  <td className='border px-2 py-1'>{r.thang}/{r.nam}</td>
                  <td className='border px-2 py-1'>{r.so_dien_cu}</td>
                  <td className='border px-2 py-1'>{r.so_dien_moi}</td>
                  <td className='border px-2 py-1 text-blue-700 font-bold'>{r.dien_tieu_thu}</td>
                  <td className='border px-2 py-1'>{r.so_nuoc_cu}</td>
                  <td className='border px-2 py-1'>{r.so_nuoc_moi}</td>
                  <td className='border px-2 py-1 text-blue-700 font-bold'>{r.nuoc_tieu_thu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!selectedRoom ? (
        <>
          <h2 className='text-lg font-semibold mb-2'>Chọn phòng để quản lý</h2>
          <div className='grid grid-cols-4 gap-4'>
          {filteredRooms.slice().sort((a, b) => a.ten_phong.localeCompare(b.ten_phong)).map(room => (
              <div
                key={room.ma_phong}
                className='p-4 border rounded cursor-pointer hover:bg-blue-100 transition'
                onClick={() => handleSelectRoom(room)}
              >
                <h3 className='font-bold'>{room.ten_phong}</h3>
                <p className='text-xs text-gray-500 break-all'>{room.ma_phong}</p>
              </div>
          ))}
          </div>
        </>
      ) : (
        <>
          <button
            className='mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
            onClick={handleBack}
          >
            ← Quay lại danh sách phòng
          </button>
          <h2 className='text-xl font-bold mb-4'>Phòng: {selectedRoom.ten_phong}</h2>
          {/* Form thêm/sửa */}
          <div className='flex gap-4 mb-4'>
        <input
          type='number'
              name='thang'
          placeholder='Tháng'
          className='p-2 border rounded'
          value={form.thang}
              onChange={handleFormChange}
        />
        <input
          type='number'
              name='nam'
          placeholder='Năm'
          className='p-2 border rounded'
          value={form.nam}
              onChange={handleFormChange}
        />
        <input
          type='number'
              name='so_dien'
          placeholder='Số điện'
          className='p-2 border rounded'
          value={form.so_dien}
              onChange={handleFormChange}
        />
        <input
          type='number'
              name='so_nuoc'
          placeholder='Số nước'
          className='p-2 border rounded'
          value={form.so_nuoc}
              onChange={handleFormChange}
            />
            <button
              className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={handleAddOrUpdate}
            >
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {isEditing && (
              <button
                className='px-3 py-2 rounded bg-gray-300 hover:bg-gray-400'
                onClick={() => { setForm({ ma_so: '', thang: '', nam: '', so_dien: '', so_nuoc: '' }); setIsEditing(false); }}
              >
                Huỷ
              </button>
            )}
          </div>
          {/* Bảng chỉ số */}
          <div className='overflow-x-auto'>
            <table className='min-w-full border text-center'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-2 py-1'>Tháng</th>
                  <th className='border px-2 py-1'>Năm</th>
                  <th className='border px-2 py-1'>Số điện</th>
                  <th className='border px-2 py-1'>Số nước</th>
                  <th className='border px-2 py-1'>Tiêu thụ điện</th>
                  <th className='border px-2 py-1'>Tiêu thụ nước</th>
                  <th className='border px-2 py-1'>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr><td colSpan={7} className='py-2 text-gray-400'>Chưa có dữ liệu</td></tr>
                ) : (
                  filteredEntries
                    .sort((a, b) => b.nam !== a.nam ? b.nam - a.nam : b.thang - a.thang)
                    .map(item => {
                      // Tìm entry tháng trước đó
                      let prevMonth = item.thang - 1
                      let prevYear = item.nam
                      if (prevMonth === 0) {
                        prevMonth = 12
                        prevYear = item.nam - 1
                      }
                      const prev = filteredEntries.find(e => e.thang === prevMonth && e.nam === prevYear)
                      const dienTieuThu = prev ? item.so_dien - prev.so_dien : ''
                      const nuocTieuThu = prev ? item.so_nuoc - prev.so_nuoc : ''
                      return (
                        <tr key={item.ma_so}>
                          <td className='border px-2 py-1'>{item.thang}</td>
                          <td className='border px-2 py-1'>{item.nam}</td>
                          <td className='border px-2 py-1'>{item.so_dien}</td>
                          <td className='border px-2 py-1'>{item.so_nuoc}</td>
                          <td className='border px-2 py-1 text-blue-700 font-bold'>{dienTieuThu}</td>
                          <td className='border px-2 py-1 text-blue-700 font-bold'>{nuocTieuThu}</td>
                          <td className='border px-2 py-1'>
                            <button
                              className='text-yellow-600 hover:underline mr-2'
                              onClick={() => handleEdit(item)}
                            >Sửa</button>
                            <button
                              className='text-red-500 hover:underline'
                              onClick={() => handleDelete(item.ma_so)}
                            >Xoá</button>
                          </td>
                        </tr>
                      )
                    })
                )}
              </tbody>
            </table>
      </div>
        </>
      )}
    </div>
  )
}
