import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';

// Pages placeholders (we will create them next)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PohonKinerja from './pages/PohonKinerja';
import SubelementAssessments from './pages/SubelementAssessments';
import VerificationPanel from './pages/VerificationPanel';
import Achievements from './pages/Achievements';
import UserManagement from './pages/UserManagement';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selected assessment period (year)
  const [selectedYear, setSelectedYear] = useState(() => {
    return parseInt(localStorage.getItem('spip_selected_year')) || 2026;
  });

  const changeSelectedYear = (year) => {
    setSelectedYear(year);
    localStorage.setItem('spip_selected_year', year);
  };

  // Scoring mode: 'emulation' (BPKP sheet formula bugs) or 'correct' (proper averages)
  const [calculationMode, setCalculationMode] = useState(() => {
    return localStorage.getItem('spip_calc_mode') || 'emulation';
  });

  const toggleCalculationMode = () => {
    const nextMode = calculationMode === 'emulation' ? 'correct' : 'emulation';
    setCalculationMode(nextMode);
    localStorage.setItem('spip_calc_mode', nextMode);
  };

  useEffect(() => {
    // Check if mock session exists first
    const mockSession = localStorage.getItem('mock_session');
    const mockProfile = localStorage.getItem('mock_profile');
    if (mockSession && mockProfile) {
      setSession(JSON.parse(mockSession));
      setProfile(JSON.parse(mockProfile));
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // If mock session is active, handle sign out event
        if (localStorage.getItem('mock_session')) {
          if (event === 'SIGNED_OUT') {
            localStorage.removeItem('mock_session');
            localStorage.removeItem('mock_profile');
            setSession(null);
            setProfile(null);
          }
          return;
        }

        setSession(newSession);
        if (newSession) {
          fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*, ref_opd(*)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-500">Memuat Sistem E-SPIP...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={session ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* Private Layout Routes */}
        <Route
          path="/*"
          element={
            session ? (
              <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
                <Sidebar 
                  user={session.user} 
                  profile={profile} 
                  selectedYear={selectedYear} 
                  setSelectedYear={changeSelectedYear} 
                />
                <main className="flex-1 overflow-x-hidden pb-12">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <Dashboard 
                          profile={profile} 
                          calculationMode={calculationMode} 
                          toggleCalculationMode={toggleCalculationMode} 
                          selectedYear={selectedYear}
                        />
                      } 
                    />
                    <Route 
                      path="/pohon-kinerja" 
                      element={<PohonKinerja profile={profile} selectedYear={selectedYear} />} 
                    />
                    <Route 
                      path="/subelement-assessments" 
                      element={<SubelementAssessments profile={profile} selectedYear={selectedYear} />} 
                    />
                    <Route 
                      path="/verification-panel" 
                      element={<VerificationPanel profile={profile} selectedYear={selectedYear} />} 
                    />
                    <Route 
                      path="/achievements" 
                      element={<Achievements profile={profile} selectedYear={selectedYear} />} 
                    />
                    <Route 
                      path="/user-management" 
                      element={<UserManagement profile={profile} />} 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
