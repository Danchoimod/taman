import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/taman/', // 👈 thêm dòng này/taman/ nếu dùng github
  plugins: [react()],
})
