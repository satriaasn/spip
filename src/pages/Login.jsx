import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Lock, Mail, User, Building, ShieldCheck, Key } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedOpd, setSelectedOpd] = useState('');
  const [selectedRole, setSelectedRole] = useState('OPD');
  const [opdList, setOpdList] = useState([]);
  
  // Quick Mock Login States
  const [quickRole, setQuickRole] = useState('ADMIN');
  const [quickOpd, setQuickOpd] = useState('');
  const [quickName, setQuickName] = useState('Administrator');
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch OPD list for registration dropdown
  useEffect(() => {
    async function fetchOPDs() {
      try {
        const { data, error } = await supabase
          .from('ref_opd')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;
        setOpdList(data || []);
      } catch (err) {
        console.error('Error fetching OPDs:', err);
      }
    }
    fetchOPDs();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Gagal masuk ke sistem. Periksa kembali email dan sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!fullName) {
      setError('Nama Lengkap harus diisi.');
      setLoading(false);
      return;
    }

    try {
      const metadata = {
        full_name: fullName,
        role: selectedRole,
      };

      if (selectedRole === 'OPD' && selectedOpd) {
        metadata.opd_id = parseInt(selectedOpd);
      } else if (['BAPPEDA', 'BPKAD', 'INSPEKTORAT'].includes(selectedRole)) {
        // Coordinator bodies also have corresponding OPD mappings:
        // Bappeda is OPD 1, BPKAD is OPD 26, Inspektorat is OPD 3
        if (selectedRole === 'BAPPEDA') metadata.opd_id = 1;
        if (selectedRole === 'INSPEKTORAT') metadata.opd_id = 3;
        if (selectedRole === 'BPKAD') metadata.opd_id = 26;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      
      setMessage('Pendaftaran berhasil! Silakan periksa kotak masuk email Anda untuk verifikasi, atau langsung masuk jika konfirmasi otomatis aktif.');
      setIsSignUp(false);
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal. Periksa kembali detail data Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role, opdId, opdName) => {
    const mockUser = {
      id: `mock-uuid-${role.toLowerCase()}`,
      email: `${role.toLowerCase()}@demo.spip.go.id`,
      user_metadata: {
        full_name: `${role} Demo Account`,
        role: role,
        opd_id: opdId
      }
    };
    
    const mockProfile = {
      id: mockUser.id,
      role: role,
      opd_id: opdId,
      full_name: `${role} Demo Account`,
      ref_opd: {
        id: opdId,
        code_opd: role === 'OPD' ? 'DISPUSIP' : role,
        name_opd: opdName
      }
    };

    localStorage.setItem('mock_session', JSON.stringify({ user: mockUser }));
    localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

    // Redirect to home and reload to let App.jsx pick up the session
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-100 via-sky-50 to-slate-100 p-6 relative overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-sky-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-200/20 blur-3xl animate-pulse"></div>

      <div className="w-full max-w-md bg-white/75 backdrop-blur-lg border border-sky-100/50 rounded-2xl shadow-xl shadow-sky-950/5 p-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 mb-3">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 leading-tight">E-SPIP Terintegrasi</h1>
          <p className="text-xs text-slate-500 mt-1">Sistem Penilaian Mandiri Maturitas SPIP Pemda</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg text-xs font-medium leading-relaxed">
            {message}
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Satria Destrian"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Kerja</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="operator@opd.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Kata Sandi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Key size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
              />
            </div>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Peran User (Role)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <ShieldCheck size={16} />
                  </span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="OPD">OPD (Pelaksana Evaluasi)</option>
                    <option value="BAPPEDA">Bappeda (Pemda Perencanaan)</option>
                    <option value="BPKAD">BPKAD (Pemda Keuangan & Aset)</option>
                    <option value="INSPEKTORAT">Inspektorat (Auditor Pemda & QA)</option>
                  </select>
                </div>
              </div>

              {selectedRole === 'OPD' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Instansi Perangkat Daerah (OPD)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Building size={16} />
                    </span>
                    <select
                      required
                      value={selectedOpd}
                      onChange={(e) => setSelectedOpd(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                    >
                      <option value="">Pilih Instansi...</option>
                      {opdList.map((opd) => (
                        <option key={opd.id} value={opd.id}>
                          {opd.name_opd}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <span>{isSignUp ? 'Daftar Akun Baru' : 'Masuk ke Sistem'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
            }}
            className="text-xs font-semibold text-sky-600 hover:text-sky-500 transition-colors duration-200"
          >
            {isSignUp ? 'Sudah memiliki akun? Masuk' : 'Belum memiliki akun? Daftar baru'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-1 flex items-center justify-center space-x-1">
            <span>⚡ Quick Bypass Login (Rate-Limit Safe)</span>
          </p>
          
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nama Operator</label>
              <input
                type="text"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Pilih Peran (Role)</label>
                <select
                  value={quickRole}
                  onChange={(e) => {
                    const r = e.target.value;
                    setQuickRole(r);
                    if (r === 'ADMIN') setQuickName('Admin Super');
                    else if (r === 'BAPPEDA') setQuickName('Bappeda Operator');
                    else if (r === 'BPKAD') setQuickName('BPKAD Operator');
                    else if (r === 'INSPEKTORAT') setQuickName('Inspektorat Auditor');
                    else setQuickName('Operator Dinas');
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                >
                  <option value="ADMIN">ADMINISTRATOR</option>
                  <option value="BAPPEDA">BAPPEDA</option>
                  <option value="BPKAD">BPKAD</option>
                  <option value="INSPEKTORAT">INSPEKTORAT</option>
                  <option value="OPD">OPD</option>
                </select>
              </div>

              {quickRole === 'OPD' && (
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Pilih Instansi OPD</label>
                  <select
                    value={quickOpd}
                    onChange={(e) => setQuickOpd(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="">Pilih...</option>
                    {opdList.map(o => (
                      <option key={o.id} value={o.id}>{o.name_opd}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                let id = 1;
                let name = 'Badan Perencanaan Pembangunan Daerah';
                
                if (quickRole === 'INSPEKTORAT') {
                  id = 3;
                  name = 'Inspektorat';
                } else if (quickRole === 'BPKAD') {
                  id = 26;
                  name = 'Badan Pengelolaan Keuangan dan Aset Daerah Provinsi Lampung';
                } else if (quickRole === 'OPD') {
                  const selected = opdList.find(o => String(o.id) === String(quickOpd));
                  if (!selected) {
                    alert('Silakan pilih Instansi OPD terlebih dahulu!');
                    return;
                  }
                  id = selected.id;
                  name = selected.name_opd;
                }

                const mockUser = {
                  id: `mock-uuid-${quickRole.toLowerCase()}-${id}`,
                  email: `${quickRole.toLowerCase()}_${id}@demo.spip.go.id`,
                  user_metadata: {
                    full_name: quickName,
                    role: quickRole,
                    opd_id: id
                  }
                };
                
                const mockProfile = {
                  id: mockUser.id,
                  role: quickRole,
                  opd_id: id,
                  full_name: quickName,
                  ref_opd: {
                    id: id,
                    code_opd: quickRole === 'OPD' ? 'DISPUSIP' : quickRole,
                    name_opd: name
                  }
                };

                localStorage.setItem('mock_session', JSON.stringify({ user: mockUser }));
                localStorage.setItem('mock_profile', JSON.stringify(mockProfile));
                window.location.href = '/';
              }}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-sky-600/10 flex items-center justify-center space-x-1.5"
            >
              <span>🔑 Bypass &amp; Masuk ke Sistem</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
