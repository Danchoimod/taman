import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const ZnsManager = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState({
    ma_phong: '',
    thang_nam: '',
    customer_name: '',
    dien_cu: '',
    dien_moi: '',
    nuoc_cu: '',
    nuoc_moi: '',
    tien_phong: '',
    gia_dien: '',
    gia_nuoc: '',
  })
  const [calculating, setCalculating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchInvoices()
    fetchRooms()
    fetchBranches()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('hoa_don')
      .select('*')
      .order('thang_nam', { ascending: false })
    if (!error && data) setInvoices(data)
    setLoading(false)
  }

  const fetchRooms = async () => {
    const { data, error } = await supabase.from('phong').select('ma_phong, ten_phong, gia_phong, ma_chi_nhanh')
    if (!error && data) setRooms(data)
  }

  const fetchBranches = async () => {
    const { data, error } = await supabase.from('chi_nhanh').select('ma_chi_nhanh, ten_chi_nhanh, gia_dien, gia_nuoc')
    if (!error && data) setBranches(data)
  }

  // Lấy giá điện/nước và tiền phòng tự động khi chọn phòng
  useEffect(() => {
    if (!form.ma_phong) return
    const room = rooms.find(r => r.ma_phong === form.ma_phong)
    if (room) {
      setForm(f => ({ ...f, tien_phong: room.gia_phong }))
      const branch = branches.find(b => b.ma_chi_nhanh === room.ma_chi_nhanh)
      if (branch) {
        setForm(f => ({ ...f, gia_dien: branch.gia_dien, gia_nuoc: branch.gia_nuoc }))
      }
    }
    // Lấy 2 bill gần nhất của phòng này
    const fetchLast2Bills = async () => {
      const { data, error } = await supabase
        .from('hoa_don')
        .select('*')
        .eq('ma_phong', form.ma_phong)
        .order('thang_nam', { ascending: false })
        .limit(2)
      if (!error && data && data.length >= 2) {
        // Bill mới nhất và bill liền trước
        const [billMoi, billCu] = data
        setForm(f => ({
          ...f,
          dien_cu: billCu.dien_moi,
          dien_moi: billMoi.dien_moi,
          nuoc_cu: billCu.nuoc_moi,
          nuoc_moi: billMoi.nuoc_moi,
        }))
      } else if (!error && data && data.length === 1) {
        // Chỉ có 1 bill, điền điện cũ/nước cũ = bill đó, điện mới/nước mới để trống
        const bill = data[0]
        setForm(f => ({
          ...f,
          dien_cu: bill.dien_moi,
          nuoc_cu: bill.nuoc_moi,
          dien_moi: '',
          nuoc_moi: '',
        }))
      } else {
        // Không có bill nào
        setForm(f => ({
          ...f,
          dien_cu: '',
          nuoc_cu: '',
          dien_moi: '',
          nuoc_moi: '',
        }))
      }
    }
    fetchLast2Bills()
  }, [form.ma_phong, rooms, branches])

  // Tính tiền điện, nước, tổng tiền
  const calcTienDien = () => {
    const { dien_cu, dien_moi, gia_dien } = form
    if (dien_cu === '' || dien_moi === '' || gia_dien === '') return 0
    return (Number(dien_moi) - Number(dien_cu)) * Number(gia_dien)
  }
  const calcTienNuoc = () => {
    const { nuoc_cu, nuoc_moi, gia_nuoc } = form
    if (nuoc_cu === '' || nuoc_moi === '' || gia_nuoc === '') return 0
    return (Number(nuoc_moi) - Number(nuoc_cu)) * Number(gia_nuoc)
  }
  const calcTongTien = () => {
    return calcTienDien() + calcTienNuoc() + Number(form.tien_phong || 0)
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreateBill = async () => {
    if (!form.ma_phong || !form.thang_nam || !form.customer_name || form.dien_cu === '' || form.dien_moi === '' || form.nuoc_cu === '' || form.nuoc_moi === '' || form.tien_phong === '' || form.gia_dien === '' || form.gia_nuoc === '') {
      alert('Vui lòng nhập đầy đủ thông tin!')
      return
    }
    setCalculating(true)
    const tien_dien = calcTienDien()
    const tien_nuoc = calcTienNuoc()
    const tong_tien = calcTongTien()
    let error = null
    if (isEditing && editingId) {
      // Update
      const res = await supabase.from('hoa_don').update({
        ma_phong: form.ma_phong,
        thang_nam: form.thang_nam,
        customer_name: form.customer_name,
        dien_cu: Number(form.dien_cu),
        dien_moi: Number(form.dien_moi),
        tien_dien,
        nuoc_cu: Number(form.nuoc_cu),
        nuoc_moi: Number(form.nuoc_moi),
        tien_nuoc,
        tien_phong: Number(form.tien_phong),
        tong_tien,
      }).eq('ma_hoa_don', editingId)
      error = res.error
    } else {
      // Insert mới
      const res = await supabase.from('hoa_don').insert([
        {
          ma_phong: form.ma_phong,
          thang_nam: form.thang_nam,
          customer_name: form.customer_name,
          dien_cu: Number(form.dien_cu),
          dien_moi: Number(form.dien_moi),
          tien_dien,
          nuoc_cu: Number(form.nuoc_cu),
          nuoc_moi: Number(form.nuoc_moi),
          tien_nuoc,
          tien_phong: Number(form.tien_phong),
          tong_tien,
        }
      ])
      error = res.error
    }
    setCalculating(false)
    if (error) {
      alert((isEditing ? 'Lỗi cập nhật hóa đơn: ' : 'Lỗi tạo hóa đơn: ') + error.message)
    } else {
      setForm({
        ma_phong: '',
        thang_nam: '',
        customer_name: '',
        dien_cu: '',
        dien_moi: '',
        nuoc_cu: '',
        nuoc_moi: '',
        tien_phong: '',
        gia_dien: '',
        gia_nuoc: '',
      })
      setIsEditing(false)
      setEditingId(null)
      fetchInvoices()
    }
  }

  const handleEdit = (hd) => {
    setForm({
      ma_phong: hd.ma_phong,
      thang_nam: hd.thang_nam,
      customer_name: hd.customer_name,
      dien_cu: hd.dien_cu,
      dien_moi: hd.dien_moi,
      nuoc_cu: hd.nuoc_cu,
      nuoc_moi: hd.nuoc_moi,
      tien_phong: hd.tien_phong,
      gia_dien: form.gia_dien, // giữ nguyên giá điện/nước hiện tại hoặc tự động lấy lại nếu cần
      gia_nuoc: form.gia_nuoc,
    })
    setIsEditing(true)
    setEditingId(hd.ma_hoa_don)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá hóa đơn này?')) return
    const { error } = await supabase.from('hoa_don').delete().eq('ma_hoa_don', id)
    if (error) {
      alert('Lỗi xoá hóa đơn: ' + error.message)
    } else {
      fetchInvoices()
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Danh sách hóa đơn</h1>
      {/* Form tạo bill mới */}
      <div className="mb-8 p-4 bg-gray-50 rounded shadow">
        <h2 className="font-semibold mb-2">Tạo hóa đơn mới</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <select name="ma_phong" value={form.ma_phong} onChange={handleFormChange} className="p-2 border rounded">
            <option value="">Chọn phòng</option>
            {rooms.map(r => (
              <option key={r.ma_phong} value={r.ma_phong}>{r.ten_phong}</option>
            ))}
          </select>
          <input name="thang_nam" value={form.thang_nam} onChange={handleFormChange} className="p-2 border rounded" placeholder="Tháng/Năm (VD: 06/2024)" />
          <input name="customer_name" value={form.customer_name} onChange={handleFormChange} className="p-2 border rounded" placeholder="Tên khách hàng" />
          <input name="tien_phong" value={form.tien_phong} onChange={handleFormChange} className="p-2 border rounded" placeholder="Tiền phòng" type="number" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <input name="dien_cu" value={form.dien_cu} onChange={handleFormChange} className="p-2 border rounded" placeholder="Điện cũ" type="number" />
          <input name="dien_moi" value={form.dien_moi} onChange={handleFormChange} className="p-2 border rounded" placeholder="Điện mới" type="number" />
          <input name="gia_dien" value={form.gia_dien} onChange={handleFormChange} className="p-2 border rounded" placeholder="Giá điện" type="number" />
          <input name="nuoc_cu" value={form.nuoc_cu} onChange={handleFormChange} className="p-2 border rounded" placeholder="Nước cũ" type="number" />
          <input name="nuoc_moi" value={form.nuoc_moi} onChange={handleFormChange} className="p-2 border rounded" placeholder="Nước mới" type="number" />
          <input name="gia_nuoc" value={form.gia_nuoc} onChange={handleFormChange} className="p-2 border rounded" placeholder="Giá nước" type="number" />
        </div>
        <div className="flex flex-wrap gap-4 items-center mb-2">
          <div>Tiền điện: <span className="font-semibold text-blue-700">{calcTienDien().toLocaleString()}</span></div>
          <div>Tiền nước: <span className="font-semibold text-blue-700">{calcTienNuoc().toLocaleString()}</span></div>
          <div>Tổng tiền: <span className="font-bold text-green-700 text-lg">{calcTongTien().toLocaleString()}</span></div>
        </div>
        <button
          className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-60`}
          onClick={handleCreateBill}
          disabled={calculating}
        >
          {calculating ? 'Đang lưu...' : isEditing ? 'Lưu cập nhật' : 'Tạo hóa đơn'}
        </button>
        {isEditing && (
          <button
            className="ml-2 px-3 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={() => { setForm({ ma_phong: '', thang_nam: '', customer_name: '', dien_cu: '', dien_moi: '', nuoc_cu: '', nuoc_moi: '', tien_phong: '', gia_dien: '', gia_nuoc: '' }); setIsEditing(false); setEditingId(null); }}
          >
            Huỷ
          </button>
        )}
      </div>
      {loading && <div className="text-blue-500 mb-4">Đang tải...</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Khách hàng</th>
              <th className="px-2 py-1 border">Tháng/Năm</th>
              <th className="px-2 py-1 border">Phòng</th>
              <th className="px-2 py-1 border">Điện cũ</th>
              <th className="px-2 py-1 border">Điện mới</th>
              <th className="px-2 py-1 border">Tiền điện</th>
              <th className="px-2 py-1 border">Nước cũ</th>
              <th className="px-2 py-1 border">Nước mới</th>
              <th className="px-2 py-1 border">Tiền nước</th>
              <th className="px-2 py-1 border">Tiền phòng</th>
              <th className="px-2 py-1 border">Tổng tiền</th>
              <th className="px-2 py-1 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((hd) => (
              <tr key={hd.ma_hoa_don}>
                <td className="px-2 py-1 border">{hd.customer_name}</td>
                <td className="px-2 py-1 border">{hd.thang_nam}</td>
                <td className="px-2 py-1 border">{rooms.find(r => r.ma_phong === hd.ma_phong)?.ten_phong || hd.ma_phong || '-'}</td>
                <td className="px-2 py-1 border">{hd.dien_cu}</td>
                <td className="px-2 py-1 border">{hd.dien_moi}</td>
                <td className="px-2 py-1 border">{Number(hd.tien_dien).toLocaleString()}</td>
                <td className="px-2 py-1 border">{hd.nuoc_cu}</td>
                <td className="px-2 py-1 border">{hd.nuoc_moi}</td>
                <td className="px-2 py-1 border">{Number(hd.tien_nuoc).toLocaleString()}</td>
                <td className="px-2 py-1 border">{Number(hd.tien_phong).toLocaleString()}</td>
                <td className="px-2 py-1 border font-bold text-blue-700">{Number(hd.tong_tien).toLocaleString()}</td>
                <td className="px-2 py-1 border">
                  <button className="text-yellow-600 hover:underline mr-2" onClick={() => handleEdit(hd)}>Sửa</button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDelete(hd.ma_hoa_don)}>Xoá</button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && !loading && (
              <tr><td colSpan={12} className="text-center py-4">Không có hóa đơn nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ZnsManager