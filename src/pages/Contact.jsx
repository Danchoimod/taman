          <section className="text-center">
            <Notification notfi="Giới thiệu" />
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
                  Nhà trọ <span className="text-blue-600 font-bold">Tâm An</span> tự hào mang đến một không gian sống hiện đại, 
                  an toàn, tiện nghi và đặc biệt là sự tự do tối đa. Chúng tôi hiểu rằng, một môi trường sống tốt không chỉ là 
                  nơi để ngả lưng mà còn là bệ phóng cho học tập và sự nghiệp của bạn.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-blue-600">100+</div>
                    <div className="text-gray-600">Sinh viên tin tưởng</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-green-600">24/7</div>
                    <div className="text-gray-600">Hỗ trợ an ninh</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-purple-600">5★</div>
                    <div className="text-gray-600">Đánh giá trung bình</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tiện nghi Section */}
          <section>
            <Notification notfi="Tiện nghi nổi bật" />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Amenities
                icon="📶"
                title="Wifi tốc độ cao"
                message="Kết nối ổn định, hỗ trợ học tập và làm việc online hiệu quả."
                gradient="from-blue-500 to-cyan-500"
              />
              <Amenities
                icon="🔒"
                title="Camera an ninh"
                message="Hệ thống giám sát 24/7 đảm bảo an toàn tuyệt đối."
                gradient="from-green-500 to-emerald-500"
              />
              <Amenities
                icon="🛒"
                title="Tạp hóa & giặt ủi"
                message="Tiết kiệm thời gian, thuận tiện cho sinh hoạt hàng ngày."
                gradient="from-purple-500 to-violet-500"
              />
              <Amenities
                icon="🐕"
                title="Cho phép nuôi thú cưng"
                message="Thoải mái sống cùng thú cưng mà không bị ràng buộc."
                gradient="from-pink-500 to-rose-500"
              />
              <Amenities
                icon="❄️"
                title="Điều hòa mát mẻ"
                message="Giữ cho căn phòng luôn dễ chịu, kể cả ngày hè oi bức."
                gradient="from-cyan-500 to-blue-500"
              />
              <Amenities
                icon="🕐"
                title="Tự do giờ giấc"
                message="Không giới hạn giờ giấc ra vào, phù hợp mọi lối sống."
                gradient="from-orange-500 to-red-500"
              />
            </div>
          </section>