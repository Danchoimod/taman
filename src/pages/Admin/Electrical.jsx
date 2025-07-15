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

  useEffect(() => {
    fetchRooms()
    fetchEntries()
  }, [])

  const fetchRooms = async () => {
    const { data, error } = await supabase.from('phong').select('ma_phong, ten_phong')
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

  // Lọc entries theo phòng đang chọn
  const filteredEntries = selectedRoom
    ? entries.filter(e => e.ma_phong === selectedRoom.ma_phong)
    : []

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

  // --- UI ---
  return (
    <div className='p-8 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Quản lý chỉ số điện nước</h1>
      {!selectedRoom ? (
        <>
          <h2 className='text-lg font-semibold mb-2'>Chọn phòng để quản lý</h2>
          <div className='grid grid-cols-4 gap-4'>
            {rooms.map(room => (
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
                  <th className='border px-2 py-1'>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr><td colSpan={5} className='py-2 text-gray-400'>Chưa có dữ liệu</td></tr>
                ) : (
                  filteredEntries
                    .sort((a, b) => b.nam !== a.nam ? b.nam - a.nam : b.thang - a.thang)
                    .map(item => (
                      <tr key={item.ma_so}>
                        <td className='border px-2 py-1'>{item.thang}</td>
                        <td className='border px-2 py-1'>{item.nam}</td>
                        <td className='border px-2 py-1'>{item.so_dien}</td>
                        <td className='border px-2 py-1'>{item.so_nuoc}</td>
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
                    ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
