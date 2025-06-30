import React from 'react'
import Zalo from '../assets/img/zalo-icon.png'; // ✅ đường dẫn chính xác đến ảnh Zalo

const zaloFloat = () => {
    return (
        <div className='w-14 fixed bottom-0 right-0 mb-10 mr-5'>
            <img src={Zalo} alt="" />
        </div>
    )
}

export default zaloFloat