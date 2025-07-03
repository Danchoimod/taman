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
      className='bg-notfi text-white w-fit px-16 py-3 font-bold my-5 rounded-r-lg'
    >
      {tieude}
    </button>
  );
};

export default Title;
