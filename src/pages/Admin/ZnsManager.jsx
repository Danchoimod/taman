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
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);

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

  // Chọn tất cả
  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(invoices.map(hd => hd.ma_hoa_don));
      setSelectAll(true);
    }
  };
  // Chọn từng hóa đơn
  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Hàm gửi Zalo Notification cho 1 hóa đơn (dùng template_id 441365)
  const sendZalo = async (hd) => {
    try {
      const res = await fetch('/api/zalo/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: hd.so_dien_thoai,
          template_id: 441365,
          params: {
            nuoc_moi: hd.nuoc_moi,
            thang_nam: hd.thang_nam,
            nuoc_cu: hd.nuoc_cu,
            tien_nuoc: hd.tien_nuoc,
            customer_name: hd.ho_ten || hd.customer_name,
            tien_phong: hd.tien_phong,
            dien_cu: hd.dien_cu,
            dien_moi: hd.dien_moi,
            tien_dien: hd.tien_dien,
            tong_tien: hd.tong_tien
          }
        })
      });
      // Kiểm tra content-type
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        return { success: false, message: 'Lỗi backend: ' + text };
      }
      const data = await res.json();
      return data.success ? { success: true } : { success: false, message: data.message || 'Gửi thất bại' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Gửi hàng loạt
  const handleSendBatch = async () => {
    setShowSendModal(true);
    setSending(true);
    setSendResults([]);
    const selectedInvoices = invoices.filter(hd => selected.includes(hd.ma_hoa_don));
    const results = [];
    for (let i = 0; i < selectedInvoices.length; i++) {
      const hd = selectedInvoices[i];
      setSendResults(r => ([...r, { id: hd.ma_hoa_don, status: 'sending' }]));
      const result = await sendZalo(hd);
      results.push({ id: hd.ma_hoa_don, status: result.success ? 'success' : 'fail', message: result.message });
      setSendResults(r => r.map(x => x.id === hd.ma_hoa_don ? { ...x, status: result.success ? 'success' : 'fail', message: result.message } : x));
    }
    setSending(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Danh sách hóa đơn</h1>
      {/* Nút gửi hàng loạt */}
      <div className="mb-4 flex gap-4 items-center">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
          disabled={selected.length === 0 || sending}
          onClick={handleSendBatch}
        >
          Gửi Zalo hàng loạt ({selected.length})
        </button>
        {selected.length > 0 && !sending && (
          <button className="text-red-500 underline" onClick={() => { setSelected([]); setSelectAll(false); }}>Bỏ chọn</button>
        )}
      </div>
      {/* Modal tiến trình gửi */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg min-w-[350px] max-w-[90vw]">
            <div className="flex items-center gap-3 mb-4">
              <svg className={`w-8 h-8 ${sending ? 'animate-spin text-blue-500' : 'text-green-600'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" />
                <path className="opacity-75" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-lg font-bold">{sending ? 'Đang gửi Zalo...' : 'Hoàn thành gửi Zalo'}</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto mb-4">
              {invoices.filter(hd => selected.includes(hd.ma_hoa_don)).map((hd, idx) => {
                const result = sendResults.find(r => r.id === hd.ma_hoa_don);
                return (
                  <div key={hd.ma_hoa_don} className="flex items-center gap-2 mb-1">
                    <span className="w-6 text-center">{idx + 1}</span>
                    <span className="flex-1">{hd.ho_ten} ({hd.so_dien_thoai})</span>
                    {result?.status === 'sending' && <span className="text-blue-500">Đang gửi...</span>}
                    {result?.status === 'success' && <span className="text-green-600">✔ Đã gửi</span>}
                    {result?.status === 'fail' && <span className="text-red-500">✖ Thất bại: {result.message}</span>}
                    {!result && <span className="text-gray-400">Chờ...</span>}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 font-semibold"
                onClick={() => setShowSendModal(false)}
                disabled={sending}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 border">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              </th>
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
                <td className="px-2 py-1 border text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(hd.ma_hoa_don)}
                    onChange={() => handleSelect(hd.ma_hoa_don)}
                    disabled={sending}
                  />
                </td>
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
                <td colSpan={13} className="text-center py-4">Không có hóa đơn nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
