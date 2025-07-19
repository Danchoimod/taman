import React from 'react';
import { useNavigate } from 'react-router-dom';

const Title = ({ tieude}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Nếu có `page` thì chuyển đến trang đó
    // Nếu không có thì quay lại trang trước
      navigate(-1); // 👈 quay lại trang trước

  };

  return (
    <button
      onClick={handleClick}
      className='flex items-center gap-2 bg-white/80 text-blue-800 w-fit px-5 py-2 font-semibold my-5 rounded-full shadow border border-blue-100 hover:bg-blue-50 hover:text-blue-900 transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-100'
    >
      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      {tieude}
    </button>
  );
};

export default Title;
