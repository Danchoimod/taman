// AppButton.jsx
import React from 'react'

const AppButton = ({ text, onClick, type = 'button' }) => {
    return (
        <div className="justify-center items-center flex mt-5">
            <button
                type={type}
                onClick={onClick}
                className="w-full px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-xl text-lg tracking-wide uppercase border-2 border-blue-700 hover:bg-blue-700 hover:scale-105 transition-all duration-300 outline-none focus:ring-4 focus:ring-blue-200"
            >
                {text}
            </button>
        </div>
    )
}

export default AppButton
