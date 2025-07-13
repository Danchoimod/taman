import { Routes, Route } from 'react-router-dom';
import Branch from './pages/BranchSelector';
import RoomBooking from './pages/RoomBooking';
import Home from './pages/home';
import LienHe from './pages/LienHe';
import AuthPage from './pages/Admin/AuthAdmin';
import Adminbranch from './pages/Admin/Branch';
import HomeAdmin from './pages/Admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import Contract from './pages/Admin/Contract';
import Electrical from './pages/Admin/Electrical';
import Room from './pages/Admin/Room';
import ZnsManager from './pages/Admin/ZnsManager';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/branch" element={<Branch />} />
      <Route path="/booking/:branchId" element={<RoomBooking />} />
      <Route path="/lien-he" element={<LienHe />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Admin layout + route con */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<HomeAdmin />} /> {/* /admin */}
        <Route path="admin-branch" element={<Adminbranch />} /> {/* /admin/admin-branch */}
        <Route path="admin-Contract" element={<Contract />} /> 
        <Route path="admin-Electrical" element={<Electrical />} /> 
        <Route path="admin-Room" element={<Room />} /> 
        <Route path="admin-ZnsManager" element={<Contract />} /> 
      </Route>
    </Routes>
  );
}

export default App;
