import { Routes, Route } from 'react-router-dom';
import Branch from './pages/BranchSelector'
import RoomBooking from './pages/RoomBooking'
import Home from './pages/home'; // ✅ Chính xác 100%



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/branch" element={<Branch />} />
      <Route path="/booking/:branchId" element={<RoomBooking />} /> {/* ✅ Route có params */}  
    </Routes>
  );
}

export default App;
