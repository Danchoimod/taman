import React from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://xodhvzvlgwrzrdrnbzev.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGh2enZsZ3dyenJkcm5iemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjkyNTYsImV4cCI6MjA2NjkwNTI1Nn0.zNtwvH1fNH-hc6iCelhdOYgaANpnKaLjYK-OpNG4tqA')
async function signOut() {
  const { error } = await supabase.auth.signOut()
  alert("Đăng xuất thành công")
}

const AdminPanel = ({funcList}) => {
    return (
        <div className='flex h-screen'>
            <div className="w-3/10 bg-gray-200 p-4 flex-row cursor-pointer">
                {funcList.map((func, idx) => ( // sử dụng map để lặp qua mảng funcList
                    // và hiển thị từng chức năng
                    <div key={idx} onClick={() => handleClickForFunc(idx)}>{func}</div> // key là chỉ mục của phần tử trong mảng)
                ))}
            </div>
            <div className="w-7/10 bg-white p-4">
                <p>đây là chức năng thứ nhất</p>
            </div>

        </div>
    )
}
function handleClickForFunc(idx) {
    switch (idx) {
        case 0:
            console.log("Chức năng 1 được chọn");
            break;
        case 1:
            console.log("Chức năng 2 được chọn");
            break;
        case 2:
            console.log("Chức năng 3 được chọn");
            break;
        case 3:
            console.log("Chức năng 4 được chọn");
            break;
        case 4:
            console.log("Chức năng 5 được chọn");
            break;
        case 5:
            console.log("Chức năng 6 được chọn");
            break;
        case 6:
            console.log("Đăng xuất");
            signOut();
            break;
        default:
            console.log("Chức năng không hợp lệ");
    }
}

export default AdminPanel