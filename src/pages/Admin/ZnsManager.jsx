import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function ZnsManager() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    fetchInvoices()
    fetchRooms()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('hoa_don')
      .select(`
        *,
        hop_dong:ma_hop_dong (
          so_dien_thoai,
          ho_ten
        )
      `)
      .order('thang_nam', { ascending: false })

    if (!error && data) {
      const withDetails = data.map(hd => ({
        ...hd,
        so_dien_thoai: hd.hop_dong?.so_dien_thoai ?? '(Không có)',
        ho_ten: hd.hop_dong?.ho_ten ?? hd.customer_name ?? 'Chưa có'
      }))
      setInvoices(withDetails)
    } else {
      console.error('Lỗi khi fetch hóa đơn:', error)
    }

    setLoading(false)
  }

  const fetchRooms = async () => {
    const { data, error } = await supabase.from('phong').select('ma_phong, ten_phong')
    if (!error && data) setRooms(data)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Danh sách hóa đơn</h1>
      {loading && <div className="text-blue-500 mb-4">Đang tải...</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Khách hàng</th>
              <th className="px-2 py-1 border">SĐT</th>
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
            </tr>
          </thead>
          <tbody>
            {invoices.map((hd) => (
              <tr key={hd.ma_hoa_don}>
                <td className="px-2 py-1 border">{hd.ho_ten}</td>
                <td className="px-2 py-1 border">{hd.so_dien_thoai}</td>
                <td className="px-2 py-1 border">{hd.thang_nam}</td>
                <td className="px-2 py-1 border">
                  {rooms.find(r => r.ma_phong === hd.ma_phong)?.ten_phong || hd.ma_phong || '-'}
                </td>
                <td className="px-2 py-1 border">{hd.dien_cu}</td>
                <td className="px-2 py-1 border">{hd.dien_moi}</td>
                <td className="px-2 py-1 border">{Number(hd.tien_dien).toLocaleString()}</td>
                <td className="px-2 py-1 border">{hd.nuoc_cu}</td>
                <td className="px-2 py-1 border">{hd.nuoc_moi}</td>
                <td className="px-2 py-1 border">{Number(hd.tien_nuoc).toLocaleString()}</td>
                <td className="px-2 py-1 border">{Number(hd.tien_phong).toLocaleString()}</td>
                <td className="px-2 py-1 border font-bold text-blue-700">{Number(hd.tong_tien).toLocaleString()}</td>
              </tr>
            ))}
            {invoices.length === 0 && !loading && (
              <tr>
                <td colSpan={12} className="text-center py-4">Không có hóa đơn nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
