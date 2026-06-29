import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, 
  Edit3, 
  Trash2, 
  Plus, 
  Save, 
  ShieldAlert, 
  Building, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  X 
} from 'lucide-react';

export default function UserManagement({ profile }) {
  const [profiles, setProfiles] = useState([]);
  const [opds, setOpds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals visibility
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Edit Form state
  const [editingProfile, setEditingProfile] = useState(null);
  const [editRole, setEditRole] = useState('OPD');
  const [editOpdId, setEditOpdId] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [saving, setSaving] = useState(false);

  // Create Form state
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createFullName, setCreateFullName] = useState('');
  const [createRole, setCreateRole] = useState('OPD');
  const [createOpdId, setCreateOpdId] = useState('');
  const [creating, setCreating] = useState(false);

  const userRole = profile?.role || 'OPD';

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchProfilesAndOPDs();
    }
  }, [userRole]);

  const fetchProfilesAndOPDs = async () => {
    try {
      setLoading(true);
      
      const { data: profs, error: profsErr } = await supabase
        .from('profiles')
        .select('*, ref_opd(*)')
        .order('role', { ascending: true });
      if (profsErr) throw profsErr;
      setProfiles(profs || []);

      const { data: opdList, error: opdErr } = await supabase
        .from('ref_opd')
        .select('*')
        .order('id', { ascending: true });
      if (opdErr) throw opdErr;
      setOpds(opdList || []);

    } catch (err) {
      console.error('Error loading User Management data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (p) => {
    setEditingProfile(p);
    setEditRole(p.role);
    setEditOpdId(p.opd_id || '');
    setEditFullName(p.full_name || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProfile) return;

    try {
      setSaving(true);
      
      const payload = {
        role: editRole,
        full_name: editFullName,
        opd_id: editRole === 'ADMIN' ? null : (editOpdId ? parseInt(editOpdId) : null),
        updated_at: new Date().toISOString()
      };

      if (editRole === 'BAPPEDA') payload.opd_id = 1;
      if (editRole === 'INSPEKTORAT') payload.opd_id = 3;
      if (editRole === 'BPKAD') payload.opd_id = 26;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editingProfile.id);

      if (error) throw error;

      alert('Profil user berhasil diperbarui!');
      setIsEditOpen(false);
      setEditingProfile(null);
      fetchProfilesAndOPDs();
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!createEmail || !createPassword || !createFullName) {
      alert('Mohon isi seluruh data wajib.');
      return;
    }

    try {
      setCreating(true);
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Use temp client to sign up the new user without breaking current admin session
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
      
      const metadata = {
        full_name: createFullName,
        role: createRole,
      };

      if (createRole === 'OPD' && createOpdId) {
        metadata.opd_id = parseInt(createOpdId);
      } else if (createRole === 'BAPPEDA') {
        metadata.opd_id = 1;
      } else if (createRole === 'INSPEKTORAT') {
        metadata.opd_id = 3;
      } else if (createRole === 'BPKAD') {
        metadata.opd_id = 26;
      }

      const { data, error } = await tempClient.auth.signUp({
        email: createEmail,
        password: createPassword,
        options: {
          data: metadata
        }
      });

      if (error) throw error;

      alert(`User baru (${createEmail}) berhasil ditambahkan ke sistem!`);
      
      // Reset Create Form
      setCreateEmail('');
      setCreatePassword('');
      setCreateFullName('');
      setCreateRole('OPD');
      setCreateOpdId('');
      setIsCreateOpen(false);
      
      fetchProfilesAndOPDs();
    } catch (err) {
      console.error('Error creating user:', err);
      alert(err.message || 'Gagal mendaftarkan user baru.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus user ${userEmail}? Semua data penilaian instansi yang diisi user ini akan tetap ada, namun hak login user akan dicabut.`)) {
      return;
    }

    try {
      setLoading(true);
      
      // Try to delete using RPC first (if admin created the function)
      const { error: rpcError } = await supabase.rpc('delete_user_by_admin', { user_id: userId });
      
      if (rpcError) {
        // Fallback: Delete from profiles directly
        const { error: profError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
          
        if (profError) throw profError;
      }

      alert('User berhasil dihapus dari sistem!');
      fetchProfilesAndOPDs();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.message || 'Gagal menghapus user.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const nameMatch = (p.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = p.role.toLowerCase().includes(searchQuery.toLowerCase());
    const opdMatch = (p.ref_opd?.name_opd || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || roleMatch || opdMatch;
  });

  if (userRole !== 'ADMIN') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center space-x-3">
          <ShieldAlert size={24} />
          <div>
            <h3 className="font-bold text-sm">Akses Ditolak</h3>
            <p className="text-xs mt-0.5">Hanya Administrator yang memiliki akses untuk mengelola user dan hak akses OPD.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight flex items-center">
            <Users className="mr-2.5 text-sky-600" size={26} />
            Manajemen Akun Operator &amp; OPD
          </h1>
          <p className="text-sm text-slate-500 mt-1">Buat, perbarui, dan hapus hak akses operator dinas kearsipan daerah / evaluator Pemda.</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/15 flex items-center space-x-1.5 self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Tambah User Baru</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex bg-white rounded-xl border border-slate-100 shadow-sm p-4 items-center">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Cari user berdasarkan nama, peran, atau OPD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Profiles list table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading && profiles.length === 0 ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-500 border-t-transparent"></div>
              <p className="text-xs text-slate-500">Memuat profil user...</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Nama User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Instansi OPD Terkait</th>
                <th className="p-4 text-center w-[180px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredProfiles.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <span className="text-xs font-bold text-slate-800 block">{p.full_name || 'Tanpa Nama'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      p.role === 'ADMIN' ? 'bg-red-50 text-red-700 border border-red-100' :
                      p.role === 'BAPPEDA' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                      p.role === 'BPKAD' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      p.role === 'INSPEKTORAT' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                      <Building size={14} className="text-slate-400" />
                      <span>{p.ref_opd?.name_opd || 'Seluruh Pemda (Lintas OPD)'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-sky-350 hover:bg-sky-50 text-slate-700 hover:text-sky-600 font-bold text-[10px] transition-all flex items-center space-x-1 shadow-sm"
                    >
                      <Edit3 size={11} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteUser(p.id, p.full_name || 'User')}
                      className="px-2.5 py-1.5 rounded-lg border border-red-200 hover:border-red-350 hover:bg-red-50 text-red-600 hover:text-red-700 font-bold text-[10px] transition-all flex items-center space-x-1 shadow-sm"
                    >
                      <Trash2 size={11} />
                      <span>Hapus</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus size={18} className="text-sky-600" />
                <h3 className="font-bold text-slate-800 text-sm">Registrasi User Baru</h3>
              </div>
              <button 
                onClick={() => setIsCreateOpen(false)} 
                className="text-slate-400 hover:text-slate-655"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Satria Destrian"
                  value={createFullName}
                  onChange={(e) => setCreateFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Email Kerja *</label>
                <input
                  type="email"
                  required
                  placeholder="operator.perpustakaan@lampungprov.go.id"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Sandi Akses (Min 6 Karakter) *</label>
                <input
                  type="password"
                  required
                  placeholder="******"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Peran Akses (Role) *</label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="OPD">OPD (Pelaksana Evaluasi)</option>
                  <option value="BAPPEDA">Bappeda (Pemda Perencanaan)</option>
                  <option value="BPKAD">BPKAD (Pemda Keuangan &amp; Aset)</option>
                  <option value="INSPEKTORAT">Inspektorat (Auditor Pemda &amp; QA)</option>
                  <option value="ADMIN">ADMINISTRATOR (Super Admin)</option>
                </select>
              </div>

              {createRole === 'OPD' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Pilih Dinas Instansi OPD *</label>
                  <select
                    required
                    value={createOpdId}
                    onChange={(e) => setCreateOpdId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Pilih OPD...</option>
                    {opds.map(opd => (
                      <option key={opd.id} value={opd.id}>{opd.name_opd}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Plus size={14} />
                <span>{creating ? 'Mendaftarkan...' : 'Daftarkan User'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && editingProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={18} className="text-sky-600" />
                <h3 className="font-bold text-slate-800 text-sm">Ubah Detail &amp; Hak Akses</h3>
              </div>
              <button 
                onClick={() => { setIsEditOpen(false); setEditingProfile(null); }} 
                className="text-slate-400 hover:text-slate-655"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Peran User (Role)</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="OPD">OPD (Pelaksana Evaluasi)</option>
                  <option value="BAPPEDA">Bappeda (Pemda Perencanaan)</option>
                  <option value="BPKAD">BPKAD (Pemda Keuangan &amp; Aset)</option>
                  <option value="INSPEKTORAT">Inspektorat (Auditor Pemda &amp; QA)</option>
                  <option value="ADMIN">ADMINISTRATOR (Super Admin)</option>
                </select>
              </div>

              {editRole === 'OPD' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Dinas Perangkat Daerah (OPD)</label>
                  <select
                    required
                    value={editOpdId}
                    onChange={(e) => setEditOpdId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Pilih OPD...</option>
                    {opds.map(opd => (
                      <option key={opd.id} value={opd.id}>{opd.name_opd}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Save size={14} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Hak Akses'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
