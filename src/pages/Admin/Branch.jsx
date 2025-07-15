import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Khởi tạo Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ChiNhanhManager() {
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState({
    ten_chi_nhanh: '',
    hinh_anh: '',
    gia_dien: '',
    gia_nuoc: ''
  })
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    const { data, error } = await supabase.from('chi_nhanh').select('*')
    if (error) {
      console.error('Lỗi lấy chi nhánh:', error.message)
    } else {
      setBranches(data)
    }
  }

  const handleAdd = async () => {
    const newBranch = {
      ma_chi_nhanh: uuidv4(),
      ten_chi_nhanh: form.ten_chi_nhanh,
      hinh_anh: form.hinh_anh,
      gia_dien: Number(form.gia_dien),
      gia_nuoc: Number(form.gia_nuoc)
    }

    const { error } = await supabase.from('chi_nhanh').insert([newBranch])
    if (error) {
      console.error('Lỗi thêm chi nhánh:', error.message)
    } else {
      fetchBranches()
      setForm({ ten_chi_nhanh: '', hinh_anh: '', gia_dien: '', gia_nuoc: '' })
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('chi_nhanh')
      .delete()
      .eq('ma_chi_nhanh', id)

    if (error) {
      console.error('Lỗi xoá chi nhánh:', error.message)
    } else {
      fetchBranches()
    }
  }

  const handleEdit = (branch) => {
    setForm({
      ten_chi_nhanh: branch.ten_chi_nhanh,
      hinh_anh: branch.hinh_anh,
      gia_dien: branch.gia_dien,
      gia_nuoc: branch.gia_nuoc,
    });
    setEditId(branch.ma_chi_nhanh);
  };

  const handleAddOrUpdate = async () => {
    if (!form.ten_chi_nhanh) return alert('Vui lòng nhập tên chi nhánh');
    if (editId) {
      // Update branch
      const { error } = await supabase.from('chi_nhanh').update({
        ten_chi_nhanh: form.ten_chi_nhanh,
        hinh_anh: form.hinh_anh,
        gia_dien: Number(form.gia_dien),
        gia_nuoc: Number(form.gia_nuoc),
      }).eq('ma_chi_nhanh', editId);
      if (error) alert('Lỗi cập nhật: ' + error.message);
      setEditId(null);
    } else {
      // Add branch
      const newBranch = {
        ma_chi_nhanh: uuidv4(),
        ten_chi_nhanh: form.ten_chi_nhanh,
        hinh_anh: form.hinh_anh,
        gia_dien: Number(form.gia_dien),
        gia_nuoc: Number(form.gia_nuoc)
      };
      const { error } = await supabase.from('chi_nhanh').insert([newBranch]);
      if (error) alert('Lỗi thêm chi nhánh: ' + error.message);
    }
    setForm({ ten_chi_nhanh: '', hinh_anh: '', gia_dien: '', gia_nuoc: '' });
    fetchBranches();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `branch/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('image').upload(filePath, file);
    if (uploadError) {
      alert('Lỗi upload ảnh: ' + uploadError.message);
      setUploading(false);
      return;
    }
    // Lấy public URL
    const { data } = supabase.storage.from('image').getPublicUrl(filePath);
    setForm({ ...form, hinh_anh: data.publicUrl });
    setUploading(false);
  };

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Quản lý chi nhánh</h1>

      <div className='grid grid-cols-2 gap-4 mb-6'>
        <input
          type='text'
          placeholder='Tên chi nhánh'
          className='p-2 border rounded'
          value={form.ten_chi_nhanh}
          onChange={(e) =>
            setForm({ ...form, ten_chi_nhanh: e.target.value })
          }
        />
        <div>
          <input
            type='file'
            accept='image/*'
            className='p-2 border rounded w-full'
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading && <div className='text-blue-500 text-sm'>Đang tải ảnh...</div>}
          {form.hinh_anh && (
            <img src={form.hinh_anh} alt='Xem trước' className='w-16 h-16 object-cover rounded mt-2' />
          )}
        </div>
        <input
          type='number'
          placeholder='Giá điện'
          className='p-2 border rounded'
          value={form.gia_dien}
          onChange={(e) => setForm({ ...form, gia_dien: e.target.value })}
        />
        <input
          type='number'
          placeholder='Giá nước'
          className='p-2 border rounded'
          value={form.gia_nuoc}
          onChange={(e) => setForm({ ...form, gia_nuoc: e.target.value })}
        />
      </div>

      <button
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        onClick={handleAddOrUpdate}
      >
        {editId ? 'Cập nhật' : 'Thêm chi nhánh'}
      </button>

      <div className='mt-8 grid gap-4'>
        {branches.map((branch) => (
          <div
            key={branch.ma_chi_nhanh}
            className='p-4 bg-white shadow rounded flex justify-between items-center'
          >
            <div>
              <h2 className='text-lg font-semibold'>
                {branch.ten_chi_nhanh}
              </h2>
              <p>
                Giá điện: {branch.gia_dien} - Giá nước: {branch.gia_nuoc}
              </p>
            </div>
            <div className='flex gap-3 items-center'>
              <img
                src={branch.hinh_anh}
                alt='ảnh'
                className='w-16 h-16 object-cover rounded'
              />
              <button
                onClick={() => handleEdit(branch)}
                className='text-blue-500 hover:text-blue-700'
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(branch.ma_chi_nhanh)}
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