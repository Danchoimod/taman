function HouseImage({ imgUrl, featured = false }) {
  return (
    <div className={`relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${featured ? 'h-80' : 'h-64'}`}>
      <img 
        src={imgUrl} 
        alt="Hình nhà trọ" 
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      
      {/* Overlay hiệu ứng */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 text-white">
          <h4 className="font-semibold text-lg">Phòng hiện đại</h4>
          <p className="text-sm opacity-90">Đầy đủ tiện nghi</p>
        </div>
      </div>

      {/* View button */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-colors duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
export default HouseImage;