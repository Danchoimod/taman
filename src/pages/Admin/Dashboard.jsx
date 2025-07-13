import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Khởi tạo Supabase client
const supabase = createClient(
  'https://xodhvzvlgwrzrdrnbzev.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGh2enZsZ3dyenJkcm5iemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjkyNTYsImV4cCI6MjA2NjkwNTI1Nn0.zNtwvH1fNH-hc6iCelhdOYgaANpnKaLjYK-OpNG4tqA'
)

const Dashboard = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  // Hàm tải danh sách ảnh từ bucket 'image' trong folder 'content'
  const fetchImages = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from('image').list('content', { limit: 100 })
    if (!error && data) {
      const files = data.filter(f => f.name)
      const urls = files.map(f => ({
        name: f.name,
        url: supabase.storage.from('image').getPublicUrl(`content/${f.name}`).data.publicUrl
      }))
      setImages(urls)
    } else {
      console.error('Lỗi load ảnh:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  // Upload ảnh vào image/content/
  const handleAddImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)

    const cleanName = file.name
      .normalize('NFD').replace(/[^\x00-\x7F]/g, '') // Bỏ dấu
      .replace(/\s+/g, '_') // Thay khoảng trắng bằng _
    const fileName = `${uuidv4()}_${cleanName}`

    const { error: uploadError } = await supabase.storage
      .from('image')
      .upload(`content/${fileName}`, file)

    if (uploadError) {
      alert('Lỗi upload ảnh: ' + uploadError.message)
      console.error('Upload error:', uploadError)
      setLoading(false)
      return
    }

    await fetchImages()
    setLoading(false)
  }

  // Xoá ảnh trong image/content/
  const handleDeleteImage = async (idx) => {
    const img = images[idx]
    setLoading(true)

    const { error } = await supabase.storage
      .from('image')
      .remove([`content/${img.name}`])

    if (error) {
      alert('Lỗi xoá ảnh: ' + error.message)
      console.error('Delete error:', error)
    } else {
      await fetchImages()
    }

    setLoading(false)
  }

  return (
    <div className="p-4">
      <p className="font-bold text-lg mb-4">📷 Quản lý hình ảnh (bucket: image / content)</p>

      <form onSubmit={e => e.preventDefault()} className="flex items-center gap-2 mb-4">
        <input
          type="file"
          accept="image/*"
          id="upload-image"
          onChange={handleAddImage}
          className="hidden"
          disabled={loading}
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
          onClick={() => document.getElementById('upload-image').click()}
        >
          {loading ? 'Đang xử lý...' : 'Tải lên ảnh'}
        </button>
      </form>

      {loading && <div className="text-blue-500 mb-4">⏳ Đang xử lý...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <div key={img.name} className="relative border rounded-lg shadow">
            <img src={img.url} alt={img.name} className="rounded-xl w-full" />
            <button
              onClick={() => handleDeleteImage(idx)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow"
              title="Xoá ảnh"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
