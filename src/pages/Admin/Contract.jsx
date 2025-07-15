import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Contract() {
  const [contracts, setContracts] = useState([])
  const [form, setForm] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    ma_phong: '',
    ngay_bat_dau: '',
    ngay_ket_thuc: '',
    tien_coc: '',
    trang_thai: 'active',
  })
  const [editId, setEditId] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchContracts()
    fetchRooms()
  }, [])

  const fetchContracts = async () => {
    const { data, error } = await supabase
      .from('hop_dong')
      .select('*, phong(ten_phong)')
    if (error) {
      console.error('Lỗi lấy hợp đồng:', error.message)
    } else {
      setContracts(data)
    }
  }

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('phong')
      .select('ma_phong, ten_phong')
      .eq('dang_trong', true); // chỉ lấy phòng trống
    if (!error) setRooms(data);
  }

  const handleAddOrUpdate = async () => {
    if (!form.ho_ten) return alert('Vui lòng nhập họ tên');
    if (!form.ma_phong) return alert('Vui lòng chọn phòng');
    if (editId) {
      // Update
      const { error } = await supabase.from('hop_dong').update({
        ho_ten: form.ho_ten,
        so_dien_thoai: form.so_dien_thoai,
        ma_phong: form.ma_phong,
        ngay_bat_dau: form.ngay_bat_dau,
        ngay_ket_thuc: form.ngay_ket_thuc,
        tien_coc: Number(form.tien_coc),
        trang_thai: form.trang_thai,
      }).eq('ma_hop_dong', editId);
      if (error) alert('Lỗi cập nhật: ' + error.message);
      setEditId(null);
    } else {
      // Add
      const newContract = {
        ma_hop_dong: uuidv4(),
        ho_ten: form.ho_ten,
        so_dien_thoai: form.so_dien_thoai,
        ma_phong: form.ma_phong,
        ngay_bat_dau: form.ngay_bat_dau,
        ngay_ket_thuc: form.ngay_ket_thuc,
        tien_coc: Number(form.tien_coc),
        trang_thai: form.trang_thai,
      }
      const { error } = await supabase.from('hop_dong').insert([newContract])
      if (error) alert('Lỗi thêm hợp đồng: ' + error.message);
    }
    setForm({
      ho_ten: '',
      so_dien_thoai: '',
      ma_phong: '',
      ngay_bat_dau: '',
      ngay_ket_thuc: '',
      tien_coc: '',
      trang_thai: 'active',
    });
    fetchContracts();
  }

  const handleEdit = (hd) => {
    setForm({
      ho_ten: hd.ho_ten,
      so_dien_thoai: hd.so_dien_thoai,
      ma_phong: hd.ma_phong,
      ngay_bat_dau: hd.ngay_bat_dau,
      ngay_ket_thuc: hd.ngay_ket_thuc,
      tien_coc: hd.tien_coc,
      trang_thai: hd.trang_thai,
    });
    setEditId(hd.ma_hop_dong);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá hợp đồng này?')) return;
    const { error } = await supabase
      .from('hop_dong')
      .delete()
      .eq('ma_hop_dong', id)

    if (error) {
      console.error('Lỗi xoá:', error.message)
    } else {
      fetchContracts()
    }
  }

  const handleReset = () => {
    setForm({
      ho_ten: '',
      so_dien_thoai: '',
      ma_phong: '',
      ngay_bat_dau: '',
      ngay_ket_thuc: '',
      tien_coc: '',
      trang_thai: 'active',
    });
    setEditId(null);
  }

  return (
    <div className='p-8 max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Quản lý hợp đồng</h1>

      <div className='grid grid-cols-2 gap-4 mb-6'>
        <input
          type='text'
          placeholder='Họ tên người thuê'
          className='p-2 border rounded'
          value={form.ho_ten}
          onChange={e => setForm({ ...form, ho_ten: e.target.value })}
        />
        <input
          type='text'
          placeholder='Số điện thoại'
          className='p-2 border rounded'
          value={form.so_dien_thoai}
          onChange={e => setForm({ ...form, so_dien_thoai: e.target.value })}
        />
        <select
          className='p-2 border rounded'
          value={form.ma_phong}
          onChange={e => setForm({ ...form, ma_phong: e.target.value })}
        >
          <option value=''>Chọn phòng</option>
          {rooms.map(room => (
            <option key={room.ma_phong} value={room.ma_phong}>{room.ten_phong}</option>
          ))}
        </select>
        <input
          type='date'
          placeholder='Ngày bắt đầu'
          className='p-2 border rounded'
          value={form.ngay_bat_dau}
          onChange={e => setForm({ ...form, ngay_bat_dau: e.target.value })}
        />
        <input
          type='date'
          placeholder='Ngày kết thúc'
          className='p-2 border rounded'
          value={form.ngay_ket_thuc}
          onChange={e => setForm({ ...form, ngay_ket_thuc: e.target.value })}
        />
        <input
          type='number'
          placeholder='Tiền cọc'
          className='p-2 border rounded'
          value={form.tien_coc}
          onChange={e => setForm({ ...form, tien_coc: e.target.value })}
        />
        <select
          className='p-2 border rounded'
          value={form.trang_thai}
          onChange={e => setForm({ ...form, trang_thai: e.target.value })}
        >
          <option value='active'>Đang hoạt động</option>
          <option value='ended'>Kết thúc</option>
          <option value='canceled'>Hủy</option>
        </select>
      </div>

      <div className='flex gap-2 mb-6'>
        <button
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
          onClick={handleAddOrUpdate}
        >
          {editId ? 'Cập nhật' : 'Thêm hợp đồng'}
        </button>
        <button
          className='bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500'
          onClick={handleReset}
        >
          Huỷ
        </button>
      </div>

      <div className='mt-8 grid gap-4'>
        {contracts.map((hd) => (
          <div
            key={hd.ma_hop_dong}
            className='p-4 bg-white shadow rounded flex justify-between items-center'
          >
            <div>
              <p className='font-semibold'>
                Người thuê: {hd.ho_ten} ({hd.so_dien_thoai}) - Phòng: {hd.phong?.ten_phong || hd.ma_phong}
              </p>
              <p>
                Từ: {hd.ngay_bat_dau} → {hd.ngay_ket_thuc || 'Chưa kết thúc'}
              </p>
              <p>
                Tiền cọc: {hd.tien_coc}đ - Trạng thái: {hd.trang_thai}
              </p>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => handleEdit(hd)}
                className='text-blue-500 hover:text-blue-700'
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(hd.ma_hop_dong)}
                className='text-red-500 hover:text-red-700'
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
