// layouts/AdminLayout.jsx
import React, { useEffect, useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import { Outlet, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://xodhvzvlgwrzrdrnbzev.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGh2enZsZ3dyenJkcm5iemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjkyNTYsImV4cCI6MjA2NjkwNTI1Nn0.zNtwvH1fNH-hc6iCelhdOYgaANpnKaLjYK-OpNG4tqA');

const AdminLayout = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate('/auth');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/auth');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!session) return null;

  return (
    <div className="flex h-screen">
      <AdminPanel />
      <div className="flex-1 p-4 overflow-auto">
        <Outlet /> {/* Trang con sẽ hiển thị ở đây */}
      </div>
    </div>
  );
};

export default AdminLayout;
