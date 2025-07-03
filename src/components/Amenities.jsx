function Amenities({ icon, title, message, gradient }) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      {/* Icon với gradient background */}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed">
        {message}
      </p>
      
      {/* Decorative bottom border */}
      <div className={`h-1 bg-gradient-to-r ${gradient} rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </div>
  );
}
export default Amenities;