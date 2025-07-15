import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

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
  const [filterMonth, setFilterMonth] = useState('')
  const [filterYear, setFilterYear] = useState('')

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
    // Lấy hợp đồng active để fill tên khách hàng
    const fetchHopDongAndSoDienNuoc = async () => {
      // Lấy hợp đồng active
      const { data: hdData } = await supabase
        .from('hop_dong')
        .select('ho_ten')
        .eq('ma_phong', form.ma_phong)
        .eq('trang_thai', 'active')
        .maybeSingle()
      if (hdData && hdData.ho_ten) {
        setForm(f => ({ ...f, customer_name: hdData.ho_ten }))
      }
      // Nếu có tháng_năm, fill chỉ số điện nước
      if (form.thang_nam) {
        const [thangStr, namStr] = form.thang_nam.split('/')
        const thang = Number(thangStr)
        const nam = Number(namStr)
        if (thang && nam) {
          // Lấy chỉ số mới
          const { data: moiArr } = await supabase
            .from('so_dien_nuoc')
            .select('*')
            .eq('ma_phong', form.ma_phong)
            .eq('thang', thang)
            .eq('nam', nam)
          const moi = moiArr && moiArr.length > 0 ? moiArr[0] : null
          // Lấy chỉ số cũ
          let prevMonth = thang - 1
          let prevYear = nam
          if (prevMonth === 0) {
            prevMonth = 12
            prevYear = nam - 1
          }
          const { data: cuArr } = await supabase
            .from('so_dien_nuoc')
            .select('*')
            .eq('ma_phong', form.ma_phong)
            .eq('thang', prevMonth)
            .eq('nam', prevYear)
          const cu = cuArr && cuArr.length > 0 ? cuArr[0] : null
          setForm(f => ({
            ...f,
            dien_cu: cu ? cu.so_dien : '',
            dien_moi: moi ? moi.so_dien : '',
            nuoc_cu: cu ? cu.so_nuoc : '',
            nuoc_moi: moi ? moi.so_nuoc : '',
          }))
        }
      }
    }
    fetchHopDongAndSoDienNuoc()
    // Lấy 2 bill gần nhất của phòng này (giữ lại cho edit bill)
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
    if (!form.thang_nam) fetchLast2Bills()
  }, [form.ma_phong, rooms, branches, form.thang_nam])

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
      // Lấy ma_hop_dong active của phòng
      let ma_hop_dong = null
      const { data: contract } = await supabase
        .from('hop_dong')
        .select('ma_hop_dong')
        .eq('ma_phong', form.ma_phong)
        .eq('trang_thai', 'active')
        .maybeSingle()
      if (contract && contract.ma_hop_dong) ma_hop_dong = contract.ma_hop_dong
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
          ma_hop_dong: ma_hop_dong,
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

  // Lọc hóa đơn theo tháng/năm
  const filteredInvoices = invoices.filter(hd => {
    if (!filterMonth && !filterYear) return true
    if (!hd.thang_nam) return false
    const [thang, nam] = hd.thang_nam.split('/')
    if (filterMonth && filterYear) return thang === filterMonth && nam === filterYear
    if (filterMonth) return thang === filterMonth
    if (filterYear) return nam === filterYear
    return true
  })

  // Xuất Excel
  const handleExportExcel = () => {
    const data = filteredInvoices.map(hd => ({
      'Khách hàng': hd.customer_name,
      'Tháng/Năm': hd.thang_nam,
      'Phòng': rooms.find(r => r.ma_phong === hd.ma_phong)?.ten_phong || hd.ma_phong || '-',
      'Điện cũ': hd.dien_cu,
      'Điện mới': hd.dien_moi,
      'Tiền điện': hd.tien_dien,
      'Nước cũ': hd.nuoc_cu,
      'Nước mới': hd.nuoc_moi,
      'Tiền nước': hd.tien_nuoc,
      'Tiền phòng': hd.tien_phong,
      'Tổng tiền': hd.tong_tien,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'HoaDon')
    XLSX.writeFile(wb, `hoa_don_${filterMonth || 'all'}_${filterYear || 'all'}.xlsx`)
  }

  // Tạo hóa đơn hàng loạt
  const handleAutoCreateBills = async () => {
    if (!filterMonth || !filterYear) {
      alert('Vui lòng nhập tháng và năm để tự tạo hóa đơn!')
      return
    }
    const month = Number(filterMonth)
    const year = Number(filterYear)
    let created = 0, skipped = 0
    for (const room of rooms) {
      // Lấy chỉ số mới
      const { data: moiArr } = await supabase
        .from('so_dien_nuoc')
        .select('*')
        .eq('ma_phong', room.ma_phong)
        .eq('thang', month)
        .eq('nam', year)
      const moi = moiArr && moiArr.length > 0 ? moiArr[0] : null
      // Lấy chỉ số cũ
      let prevMonth = month - 1
      let prevYear = year
      if (prevMonth === 0) {
        prevMonth = 12
        prevYear = year - 1
      }
      const { data: cuArr } = await supabase
        .from('so_dien_nuoc')
        .select('*')
        .eq('ma_phong', room.ma_phong)
        .eq('thang', prevMonth)
        .eq('nam', prevYear)
      const cu = cuArr && cuArr.length > 0 ? cuArr[0] : null
      // Lấy giá điện/nước, tiền phòng
      const branch = branches.find(b => b.ma_chi_nhanh === room.ma_chi_nhanh)
      // Lấy tên khách hàng và ma_hop_dong
      const { data: hdData } = await supabase
        .from('hop_dong')
        .select('ho_ten, ma_hop_dong')
        .eq('ma_phong', room.ma_phong)
        .eq('trang_thai', 'active')
        .maybeSingle()
      // Kiểm tra trùng hóa đơn
      const { data: existed } = await supabase
        .from('hoa_don')
        .select('ma_hoa_don')
        .eq('ma_phong', room.ma_phong)
        .eq('thang_nam', `${filterMonth}/${filterYear}`)
        .maybeSingle()
      if (existed) {
        skipped++
        continue
      }
      if (!moi || !cu || !branch || !hdData || !hdData.ho_ten) {
        skipped++
        continue
      }
      // Tính tiền
      const dien_cu = cu.so_dien
      const dien_moi = moi.so_dien
      const nuoc_cu = cu.so_nuoc
      const nuoc_moi = moi.so_nuoc
      const gia_dien = branch.gia_dien
      const gia_nuoc = branch.gia_nuoc
      const tien_phong = room.gia_phong
      const tien_dien = (dien_moi - dien_cu) * gia_dien
      const tien_nuoc = (nuoc_moi - nuoc_cu) * gia_nuoc
      const tong_tien = tien_dien + tien_nuoc + Number(tien_phong || 0)
      // Tạo bill
      await supabase.from('hoa_don').insert([
        {
          ma_phong: room.ma_phong,
          thang_nam: `${filterMonth}/${filterYear}`,
          customer_name: hdData.ho_ten,
          dien_cu,
          dien_moi,
          tien_dien,
          nuoc_cu,
          nuoc_moi,
          tien_nuoc,
          tien_phong,
          tong_tien,
          ma_hop_dong: hdData.ma_hop_dong,
        }
      ])
      created++
    }
    fetchInvoices()
    alert(`Đã tạo ${created} hóa đơn. Bỏ qua ${skipped} phòng thiếu dữ liệu.`)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hóa đơn</h1>
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
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <p className="p-2 border rounded bg-white">Khách hàng: <span className="font-semibold text-blue-700">{form.customer_name}</span></p>
          <p className="p-2 border rounded bg-white">Tiền phòng: <span className="font-semibold text-blue-700">{Number(form.tien_phong).toLocaleString()}</span></p>
          <p className="p-2 border rounded bg-white">Giá điện: <span className="font-semibold text-blue-700">{form.gia_dien}</span></p>
          <p className="p-2 border rounded bg-white">Giá nước: <span className="font-semibold text-blue-700">{form.gia_nuoc}</span></p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <p className="p-2 border rounded bg-white">Điện cũ: <span className="font-semibold text-blue-700">{form.dien_cu}</span></p>
          <p className="p-2 border rounded bg-white">Điện mới: <span className="font-semibold text-blue-700">{form.dien_moi}</span></p>
          <p className="p-2 border rounded bg-white">Nước cũ: <span className="font-semibold text-blue-700">{form.nuoc_cu}</span></p>
          <p className="p-2 border rounded bg-white">Nước mới: <span className="font-semibold text-blue-700">{form.nuoc_moi}</span></p>
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
        {/* Lọc và xuất excel */}
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block font-semibold mb-1">Lọc theo tháng</label>
            <input type="text" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} placeholder="VD: 06" className="p-2 border rounded w-20" maxLength={2} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Lọc theo năm</label>
            <input type="text" value={filterYear} onChange={e => setFilterYear(e.target.value)} placeholder="VD: 2024" className="p-2 border rounded w-28" maxLength={4} />
          </div>
          <button
            className="px-4 py-2 rounded bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow hover:from-green-500 hover:to-green-700 transition-all duration-300"
            onClick={handleExportExcel}
          >
            Xuất Excel
          </button>
          <button
            className="px-4 py-2 rounded bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
            onClick={handleAutoCreateBills}
          >
            Tự tạo hóa đơn hàng loạt
          </button>
        </div>
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
            {filteredInvoices.map((hd) => (
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
            {filteredInvoices.length === 0 && !loading && (
              <tr><td colSpan={12} className="text-center py-4">Không có hóa đơn nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ZnsManager