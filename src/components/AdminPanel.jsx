import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom';

const supabase = createClient('https://xodhvzvlgwrzrdrnbzev.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGh2enZsZ3dyenJkcm5iemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjkyNTYsImV4cCI6MjA2NjkwNTI1Nn0.zNtwvH1fNH-hc6iCelhdOYgaANpnKaLjYK-OpNG4tqA')
async function signOut() {
    const { error } = await supabase.auth.signOut()
    alert("Đăng xuất thành công")
}

// Thêm icon cho từng chức năng (có thể dùng emoji hoặc class icon nếu có thư viện)
const defaultFuncList = [
    {
        label: "Dashboard", icon: (
            <svg className="w-7 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
            </svg>
        )
    },
    {
        label: "chi nhánh", icon: (
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0a4 4 0 0 1-4 4h-1a3 3 0 0 0-3 3" />
            </svg>
        )
    },
    {
        label: "Hợp đồng", icon: (
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M7 2a2 2 0 0 0-2 2v1a1 1 0 0 0 0 2v1a1 1 0 0 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7Zm3 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-1 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3 1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1Z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        label: "Điện nước", icon: (
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
        )
    },
    {
        label: "phòng trò", icon: (
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.535 11A3.981 3.981 0 0 0 2 13v4a1 1 0 0 0 1 1h2v1a1 1 0 1 0 2 0v-1h10v1a1 1 0 1 0 2 0v-1h2a1 1 0 0 0 1-1v-4c0-.729-.195-1.412-.535-2H2.535ZM20 9V8a4 4 0 0 0-4-4h-3v5h7Zm-9-5H8a4 4 0 0 0-4 4v1h7V4Z" />
            </svg>
        )
    },
    {
        label: "Thông báo zalo", icon: (
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
            </svg>
        )
    },
    {
        label: "Đăng xuất", icon: (
            <svg fill="#000000" width="19px" height="19px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <title>logout-solid</title>
                <path d="M23,4H7A2,2,0,0,0,5,6V30a2,2,0,0,0,2,2H23a2,2,0,0,0,2-2V24H15.63a1,1,0,0,1-1-1,1,1,0,0,1,1-1H25V6A2,2,0,0,0,23,4Z" className="clr-i-solid clr-i-solid-path-1"></path>
                <path d="M28.16,17.28a1,1,0,0,0-1.41,1.41L30.13,22H25v2h5.13l-3.38,3.46a1,1,0,1,0,1.41,1.41L34,23.07Z" className="clr-i-solid clr-i-solid-path-2"></path>
                <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
            </svg>
        )
    },
];

const AdminPanel = ({ funcList = defaultFuncList }) => {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const navigate = useNavigate();

    function handleClickForFunc(idx) {
        setSelectedIdx(idx);
        switch (idx) {
            case 0:
                navigate('/admin'); // Dashboard
                break;
            case 1:
                navigate('/admin/admin-branch');
                break;
            case 2:
                navigate('/admin/admin-Contract');
                break;
            case 3:
                navigate('/admin/admin-Electrical');
                break;
            case 4:
                navigate('/admin/admin-Room');
                break;
            case 5:
                navigate('/admin/admin-ZnsManager');
                break;
            case 6:
                console.log("Đăng xuất");
                signOut();
                break;
            default:
                console.log("Chức năng không hợp lệ");
        }
    }

    return (
        <div className='flex h-screen'>
            <div className="w-3/10 bg-gray-200 p-4 flex-row cursor-pointer">
                {funcList.map((func, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleClickForFunc(idx)}
                        className={
                            (selectedIdx === idx ? 'bg-blue-400 text-white ' : '') +
                            'p-2 rounded mb-2 transition-colors duration-200 flex items-center justify-center md:justify-start'
                        }
                    >
                        {/* Hiển thị icon trên mobile, chữ trên desktop */}
                        <span className="block md:hidden text-2xl">{func.icon}</span>
                        <span className="hidden md:block">{func.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminPanel