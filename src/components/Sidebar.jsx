import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitFork, 
  CheckSquare, 
  ShieldAlert, 
  BarChart3, 
  LogOut, 
  Settings,
  Building2,
  FileCheck
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Sidebar({ user, profile, selectedYear, setSelectedYear }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('mock_session');
    localStorage.removeItem('mock_profile');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    window.location.href = '/login';
  };

  const role = profile?.role || 'OPD';
  const opdName = profile?.ref_opd?.name_opd || 'Umum';

  // Navigation items based on role
  const menuItems = [
    {
      path: '/',
      name: 'Simpulan Maturitas (KKLEAD_SPIP)',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT', 'OPD']
    },
    {
      path: '/pohon-kinerja',
      name: 'Kualitas Perencanaan (KKE 1.1 - 2.3)',
      icon: GitFork,
      roles: ['ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT', 'OPD']
    },
    {
      path: '/subelement-assessments',
      name: 'Penilaian Subelement (KK3.1 - 3.4)',
      icon: CheckSquare,
      roles: ['ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT', 'OPD']
    },
    {
      path: '/verification-panel',
      name: 'Panel Verifikasi Pemda (KK3)',
      icon: ShieldAlert,
      roles: ['ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT']
    },
    {
      path: '/achievements',
      name: 'Capaian & Hasil (KK5.1 - KK8)',
      icon: BarChart3,
      roles: ['ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT', 'OPD']
    },
    {
      path: '/user-management',
      name: 'Manajemen User & OPD',
      icon: Settings,
      roles: ['ADMIN']
    }
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/40">
        <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
          <FileCheck size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
            E-SPIP
          </h1>
          <span className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase">
            Terintegrasi
          </span>
        </div>
      </div>

      {/* Year Selector */}
      <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/10 flex flex-col space-y-1">
        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Periode Penilaian (Tahun)</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs py-1.5 px-2.5 text-white focus:outline-none focus:border-sky-500 font-semibold"
        >
          <option value="2024">Tahun 2024</option>
          <option value="2025">Tahun 2025</option>
          <option value="2026">Tahun 2026 (Aktif)</option>
          <option value="2027">Tahun 2027</option>
        </select>
      </div>

      {/* User Information */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-sky-100/10 text-sky-400 flex items-center justify-center font-bold text-sm border border-sky-400/20">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <h2 className="text-xs font-semibold text-white truncate" title={profile?.full_name}>
              {profile?.full_name || user?.email}
            </h2>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold bg-sky-500/20 text-sky-300 uppercase">
                {role}
              </span>
              <span className="text-[9px] text-slate-400 truncate max-w-[100px]" title={opdName}>
                {opdName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {filteredMenu.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/15'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`
              }
            >
              <Icon size={18} className="transition-transform duration-200 group-hover:scale-105" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
