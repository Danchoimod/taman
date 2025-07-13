import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom';
const supabase = createClient('https://xodhvzvlgwrzrdrnbzev.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGh2enZsZ3dyenJkcm5iemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjkyNTYsImV4cCI6MjA2NjkwNTI1Nn0.zNtwvH1fNH-hc6iCelhdOYgaANpnKaLjYK-OpNG4tqA')

export default function AuthPage() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      navigate('/Admin'); // chuyển về route đúng đã khai báo
    }
  }, [session, navigate]);

  if (!session) {
    return (
      <div>
        <Header></Header>
        <div className='mt-20'>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
        </div>
      </div>
    )
  } else {
    return null;
  }
}
