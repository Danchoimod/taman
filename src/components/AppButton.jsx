// AppButton.jsx
import React from 'react'

const AppButton = ({ text, onClick, type = 'button' }) => {
    return (
        <div className="justify-center items-center flex mt-5">            
        <button
            type={type}
            onClick={onClick}
            className="px-4 py-2 bg-white text-textColor border-black"
        >
            {text}
        </button></div>

    )
}

export default AppButton
