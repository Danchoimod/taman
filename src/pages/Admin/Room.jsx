import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Room() {
  const [phongs, setPhongs] = useState([])
  const [form, setForm] = useState({
    ten_phong: '',
    gia_phong: '',
    ma_chi_nhanh: '',
    hinh_anh: '', // thêm lại trường này
  })
  const [editId, setEditId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [filterBranch, setFilterBranch] = useState('');
  const [bulkBranch, setBulkBranch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  // Thư viện ảnh
  const [imageLibrary, setImageLibrary] = useState([]);
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  useEffect(() => {
    fetchPhongs(filterBranch)
    fetchBranches()
    fetchImageLibrary()
  }, [])

  useEffect(() => {
    fetchPhongs(filterBranch)
  }, [filterBranch])

  const fetchPhongs = async (branchId = '') => {
    let query = supabase
      .from('phong')
      .select('*, chi_nhanh(ten_chi_nhanh)');
    if (branchId) {
      query = query.eq('ma_chi_nhanh', branchId);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Lỗi khi lấy phòng:', error.message)
    } else {
      setPhongs(data)
    }
  }

  const fetchBranches = async () => {
    const { data, error } = await supabase.from('chi_nhanh').select('ma_chi_nhanh, ten_chi_nhanh');
    if (!error) setBranches(data);
  }

  // Lấy danh sách ảnh từ bucket image/room-images
  const fetchImageLibrary = async () => {
    const { data, error } = await supabase.storage.from('image').list('room-images', { limit: 100 });
    if (!error && data) {
      setImageLibrary(
        data.filter(f => f.name).map(f => ({
          name: f.name,
          url: supabase.storage.from('image').getPublicUrl(`room-images/${f.name}`).data.publicUrl
        }))
      );
    }
  };

  const handleAdd = async () => {
    const newPhong = {
      ma_phong: uuidv4(),
      ten_phong: form.ten_phong,
      gia_phong: Number(form.gia_phong),
      ma_chi_nhanh: form.ma_chi_nhanh || null,
      dang_trong: true, // Thêm dòng này
    }

    const { error } = await supabase.from('phong').insert([newPhong])
    if (error) {
      console.error('Lỗi thêm phòng:', error.message)
    } else {
      fetchPhongs()
      setForm({ ten_phong: '', gia_phong: '', ma_chi_nhanh: '' })
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('phong').delete().eq('ma_phong', id)
    if (error) {
      console.error('Lỗi xoá phòng:', error.message)
    } else {
      fetchPhongs()
    }
  }

  const handleEdit = (phong) => {
    setForm({
      ten_phong: phong.ten_phong,
      gia_phong: phong.gia_phong,
      ma_chi_nhanh: phong.ma_chi_nhanh || '',
      hinh_anh: phong.hinh_anh || '',
    });
    setEditId(phong.ma_phong);
  };

  const handleAddOrUpdate = async () => {
    if (!form.ten_phong) return alert('Vui lòng nhập tên phòng');
    let imageToUse = form.hinh_anh;
    if (!imageToUse) {
      // Nếu chưa chọn ảnh, đồng bộ như cũ
      let defaultImage = 'emptyRoom.png';
      if (form.ma_chi_nhanh) {
        const { data: roomsInBranch, error: fetchError } = await supabase
          .from('phong')
          .select('hinh_anh')
          .eq('ma_chi_nhanh', form.ma_chi_nhanh)
          .limit(1);
        if (!fetchError && roomsInBranch && roomsInBranch.length > 0 && roomsInBranch[0].hinh_anh) {
          defaultImage = roomsInBranch[0].hinh_anh;
        }
      }
      imageToUse = defaultImage;
    }
    if (editId) {
      // Update
      const { error } = await supabase.from('phong').update({
        ten_phong: form.ten_phong,
        gia_phong: Number(form.gia_phong),
        ma_chi_nhanh: form.ma_chi_nhanh || null,
        hinh_anh: imageToUse,
      }).eq('ma_phong', editId);
      if (error) alert('Lỗi cập nhật: ' + error.message);
      setEditId(null);
    } else {
      // Add
      const newPhong = {
        ma_phong: uuidv4(),
        ten_phong: form.ten_phong,
        gia_phong: Number(form.gia_phong),
        ma_chi_nhanh: form.ma_chi_nhanh || null,
        hinh_anh: imageToUse,
        dang_trong: true,
      };
      const { error } = await supabase.from('phong').insert([newPhong]);
      if (error) alert('Lỗi thêm phòng: ' + error.message);
    }
    setForm({ ten_phong: '', gia_phong: '', ma_chi_nhanh: '', hinh_anh: '' });
    fetchPhongs();
  };

  // Upload ảnh mới vào thư viện
  const handleUploadToLibrary = async (e) => {
    e.preventDefault();
    if (!newImageFile) return alert('Vui lòng chọn ảnh');
    setUploadingImage(true);
    const file = newImageFile;
    const fileExt = file.name.split('.').pop();
    const fileName = `room-images/${uuidv4()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('image')
      .upload(fileName, file);
    if (error) {
      alert('Lỗi upload ảnh: ' + error.message);
    } else {
      alert('Đã thêm ảnh vào thư viện!');
      fetchImageLibrary();
      setNewImageFile(null);
    }
    setUploadingImage(false);
  };

  return (
    <div className='p-8 max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Quản lý phòng</h1>
      {/* Upload ảnh vào thư viện */}
      <div className='mb-8 p-4 bg-gray-50 rounded shadow flex flex-col md:flex-row items-center gap-4'>
        <form onSubmit={handleUploadToLibrary} className='flex items-center gap-2'>
          <input
            type='file'
            accept='image/*'
            className='p-2 border rounded'
            onChange={e => setNewImageFile(e.target.files[0])}
            disabled={uploadingImage}
          />
          <button
            type='submit'
            className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50'
            disabled={uploadingImage}
          >
            {uploadingImage ? 'Đang tải lên...' : 'Thêm ảnh vào thư viện'}
          </button>
        </form>
      </div>
      <div className='mb-4'>
        <select
          className='p-2 border rounded'
          value={filterBranch}
          onChange={e => setFilterBranch(e.target.value)}
        >
          <option value=''>Tất cả chi nhánh</option>
          {branches.map(branch => (
            <option key={branch.ma_chi_nhanh} value={branch.ma_chi_nhanh}>
              {branch.ten_chi_nhanh}
            </option>
          ))}
        </select>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
        <input
          type='text'
          placeholder='Tên phòng'
          className='p-2 border rounded'
          value={form.ten_phong}
          onChange={(e) => setForm({ ...form, ten_phong: e.target.value })}
        />
        <input
          type='number'
          placeholder='Giá phòng'
          className='p-2 border rounded'
          value={form.gia_phong}
          onChange={(e) => setForm({ ...form, gia_phong: e.target.value })}
        />
        <select
          className='p-2 border rounded'
          value={form.ma_chi_nhanh}
          onChange={e => setForm({ ...form, ma_chi_nhanh: e.target.value })}
        >
          <option value=''>Chọn chi nhánh</option>
          {branches.map(branch => (
            <option key={branch.ma_chi_nhanh} value={branch.ma_chi_nhanh}>
              {branch.ten_chi_nhanh}
            </option>
          ))}
        </select>
        <button
          type='button'
          className='p-2 border rounded bg-gray-100 hover:bg-gray-200 col-span-2 md:col-span-1'
          onClick={() => setShowImageLibrary(true)}
        >
          {form.hinh_anh ? 'Đã chọn ảnh' : 'Chọn ảnh từ thư viện'}
        </button>
        {form.hinh_anh && (
          <img src={form.hinh_anh} alt='Ảnh phòng đã chọn' className='w-32 h-20 object-cover mt-2 col-span-2' />
        )}
      </div>
      {/* Popup chọn ảnh từ thư viện */}
      {showImageLibrary && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-4 rounded shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-2'>
              <span className='font-bold'>Chọn ảnh phòng</span>
              <button onClick={() => setShowImageLibrary(false)} className='text-red-500 font-bold'>Đóng</button>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
              {imageLibrary.map(img => (
                <img
                  key={img.name}
                  src={img.url}
                  alt={img.name}
                  className='w-full h-24 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500'
                  onClick={() => {
                    setForm(f => ({ ...f, hinh_anh: img.url }));
                    setShowImageLibrary(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        onClick={handleAddOrUpdate}
      >
        {editId ? 'Cập nhật' : 'Thêm phòng'}
      </button>

      <div className='mt-8 grid gap-4'>
        {phongs.map((phong) => (
          <div
            key={phong.ma_phong}
            className='p-4 bg-white shadow rounded flex justify-between items-center'
          >
            <div>
              {phong.hinh_anh && (
                <img src={phong.hinh_anh} alt='Hình phòng' className='w-32 h-20 object-cover mb-2' />
              )}
              <h2 className='font-bold'>{phong.ten_phong}</h2>
              <p>💰 Giá: {phong.gia_phong}đ</p>
              <p> Chi nhánh: {phong.chi_nhanh ? phong.chi_nhanh.ten_chi_nhanh : 'Không có'}</p>
              <p>
                📌 Trạng thái:{' '}
                <span
                  className={
                    phong.dang_trong ? 'text-green-600' : 'text-red-500'
                  }
                >
                  {phong.dang_trong ? 'Đang trống' : 'Đã thuê'}
                </span>
              </p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(phong)}
                className='text-blue-500 hover:text-blue-700 mr-2'
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(phong.ma_phong)}
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
