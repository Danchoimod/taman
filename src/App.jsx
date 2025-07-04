import { Routes, Route } from 'react-router-dom';
import Branch from './pages/BranchSelector'
import RoomBooking from './pages/RoomBooking'
import Home from './pages/home';
import LienHe from './pages/LienHe'; // 👈 Thêm



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/branch" element={<Branch />} />
      <Route path="/booking/:branchId" element={<RoomBooking />} /> {/* ✅ Route có params */}
      <Route path="/lien-he" element={<LienHe />} /> {/* ✅ Route mới */}
    </Routes>
  );
}

export default App;
