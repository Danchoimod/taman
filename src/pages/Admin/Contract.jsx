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
    ma_chi_nhanh: '', // thêm trường chi nhánh
    ma_phong: '',
    ngay_bat_dau: '',
    ngay_ket_thuc: '',
    tien_coc: '',
    trang_thai: 'active',
  })
  const [editId, setEditId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [branches, setBranches] = useState([]);
  const [contractBranchFilter, setContractBranchFilter] = useState('');

  useEffect(() => {
    fetchContracts()
    fetchRooms()
    fetchBranches()
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
      .select('ma_phong, ten_phong, ma_chi_nhanh')
      .eq('dang_trong', true); // chỉ lấy phòng trống
    if (!error) setRooms(data);
  }

  const fetchBranches = async () => {
    const { data, error } = await supabase.from('chi_nhanh').select('ma_chi_nhanh, ten_chi_nhanh');
    if (!error && data) setBranches(data);
  };

  const handleAddOrUpdate = async () => {
    if (!form.ho_ten) return alert('Vui lòng nhập họ tên');
    if (!form.ma_chi_nhanh) return alert('Vui lòng chọn chi nhánh');
    if (!form.ma_phong) return alert('Vui lòng chọn phòng');
    if (editId) {
      // Update
      const { error } = await supabase.from('hop_dong').update({
        ho_ten: form.ho_ten,
        so_dien_thoai: form.so_dien_thoai,
        ma_chi_nhanh: form.ma_chi_nhanh, // lưu chi nhánh
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
        ma_chi_nhanh: form.ma_chi_nhanh, // lưu chi nhánh
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
      ma_chi_nhanh: '',
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
      ma_chi_nhanh: hd.ma_chi_nhanh || '',
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
      ma_chi_nhanh: '',
      ma_phong: '',
      ngay_bat_dau: '',
      ngay_ket_thuc: '',
      tien_coc: '',
      trang_thai: 'active',
    });
    setEditId(null);
  }

  // Lọc phòng theo chi nhánh đã chọn
  const filteredRooms = form.ma_chi_nhanh ? rooms.filter(r => r.ma_chi_nhanh === form.ma_chi_nhanh) : [];
  // Lọc hợp đồng theo chi nhánh
  const filteredContracts = contractBranchFilter ? contracts.filter(hd => hd.ma_chi_nhanh === contractBranchFilter) : contracts;

  return (
    <div className='p-8 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8 text-center text-blue-700'>Quản lý hợp đồng</h1>
      {/* Combobox chọn chi nhánh và lọc phòng */}
      <div className='mb-6 flex gap-4 items-center'>
        <label className='font-semibold'>Chọn chi nhánh:</label>
        <select
          className='p-2 border rounded min-w-[200px]'
          value={form.ma_chi_nhanh}
          onChange={e => setForm(f => ({ ...f, ma_chi_nhanh: e.target.value, ma_phong: '' }))}
        >
          <option value=''>-- Chọn chi nhánh --</option>
          {branches.map(b => (
            <option key={b.ma_chi_nhanh} value={b.ma_chi_nhanh}>{b.ten_chi_nhanh}</option>
          ))}
        </select>
      </div>
      <div className='grid md:grid-cols-2 gap-8'>
        {/* FORM CARD */}
        <div className='bg-white rounded-2xl shadow-lg p-6 border border-blue-100'>
          <h2 className='text-xl font-semibold mb-4 text-blue-600'>Thêm / Cập nhật hợp đồng</h2>
          <div className='grid grid-cols-1 gap-4 mb-4'>
            <input
              type='text'
              placeholder='Họ tên người thuê'
              className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-300'
              value={form.ho_ten}
              onChange={e => setForm({ ...form, ho_ten: e.target.value })}
            />
            <input
              type='text'
              placeholder='Số điện thoại'
              className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-300'
              value={form.so_dien_thoai}
              onChange={e => setForm({ ...form, so_dien_thoai: e.target.value })}
            />
            <select
              className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-300'
              value={form.ma_phong}
              onChange={e => setForm({ ...form, ma_phong: e.target.value })}
              disabled={!form.ma_chi_nhanh}
            >
              <option value=''>{form.ma_chi_nhanh ? 'Chọn phòng' : 'Vui lòng chọn chi nhánh trước'}</option>
              {filteredRooms.map(room => (
                <option key={room.ma_phong} value={room.ma_phong}>{room.ten_phong}</option>
              ))}
            </select>
            <input
              type='date'
              placeholder='Ngày bắt đầu'
              className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-300'
              value={form.ngay_bat_dau}
              onChange={e => setForm({ ...form, ngay_bat_dau: e.target.value })}
            />
            <input
              type='date'
              placeholder='Ngày kết thúc'
              className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-300'
              value={form.ngay_ket_thuc}
              onChange={e => setForm({ ...form, ngay_ket_thuc: e.target.value })}
            />
            <input
              type='number'
              placeholder='Tiền cọc'
              className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-300'
              value={form.tien_coc}
              onChange={e => setForm({ ...form, tien_coc: e.target.value })}
            />
            <select
              className='p-3 border rounded-lg focus:ring-2 focus:ring-blue-300'
              value={form.trang_thai}
              onChange={e => setForm({ ...form, trang_thai: e.target.value })}
            >
              <option value='active'>Đang hoạt động</option>
              <option value='ended'>Kết thúc</option>
              <option value='canceled'>Hủy</option>
            </select>
          </div>
          <div className='flex gap-2 justify-end'>
            <button
              className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow'
              onClick={handleAddOrUpdate}
            >
              {editId ? 'Cập nhật' : 'Thêm hợp đồng'}
            </button>
            <button
              className='bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 font-semibold shadow'
              onClick={handleReset}
            >
              Huỷ
            </button>
          </div>
        </div>
        {/* CONTRACT LIST CARD */}
        <div className='bg-white rounded-2xl shadow-lg p-6 border border-blue-100'>
          <h2 className='text-xl font-semibold mb-4 text-blue-600'>Danh sách hợp đồng</h2>
          {/* Combobox lọc chi nhánh cho danh sách hợp đồng */}
          <div className='mb-4 flex gap-3 items-center'>
            <label className='font-semibold'>Lọc chi nhánh:</label>
            <select
              className='p-2 border rounded min-w-[180px]'
              value={contractBranchFilter}
              onChange={e => setContractBranchFilter(e.target.value)}
            >
              <option value=''>Tất cả chi nhánh</option>
              {branches.map(b => (
                <option key={b.ma_chi_nhanh} value={b.ma_chi_nhanh}>{b.ten_chi_nhanh}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-4 max-h-[600px] overflow-y-auto'>
            {filteredContracts.length === 0 && (
              <div className='text-gray-500 text-center py-8'>Chưa có hợp đồng nào.</div>
            )}
            {filteredContracts.map((hd) => (
              <div
                key={hd.ma_hop_dong}
                className='p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-2 shadow-sm hover:shadow-md transition'
              >
                <div>
                  <p className='font-semibold text-blue-900'>
                    Người thuê: <span className='text-blue-700'>{hd.ho_ten}</span> ({hd.so_dien_thoai})
                  </p>
                  <p>
                    Phòng: <span className='font-semibold text-green-700'>{hd.phong?.ten_phong || hd.ma_phong}</span>
                  </p>
                  <p>
                    Từ: <span className='font-medium'>{hd.ngay_bat_dau}</span> → <span className='font-medium'>{hd.ngay_ket_thuc || 'Chưa kết thúc'}</span>
                  </p>
                  <p>
                    Tiền cọc: <span className='font-semibold text-orange-600'>{Number(hd.tien_coc).toLocaleString('vi-VN')}đ</span> - Trạng thái: <span className={`font-semibold ${hd.trang_thai === 'active' ? 'text-green-600' : hd.trang_thai === 'ended' ? 'text-gray-500' : 'text-red-500'}`}>{hd.trang_thai}</span>
                  </p>
                </div>
                <div className='flex gap-2 justify-end'>
                  <button
                    onClick={() => handleEdit(hd)}
                    className='text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-lg border border-blue-200 bg-white shadow-sm'
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(hd.ma_hop_dong)}
                    className='text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-lg border border-red-200 bg-white shadow-sm'
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
