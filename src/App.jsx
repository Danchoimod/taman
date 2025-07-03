import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Branch from './pages/BranchSelector'
import RoomBooking from './pages/RoomBooking'



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
