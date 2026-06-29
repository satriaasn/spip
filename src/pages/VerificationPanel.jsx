import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  ShieldAlert, 
  CheckCircle, 
  HelpCircle, 
  Edit3,
  Building,
  UserCheck
} from 'lucide-react';

const PILLARS = [
  { id: 'T1', name: 'Tujuan 1: Efektivitas & Efisiensi (Bappeda)', code: 'KK3.1' },
  { id: 'T2', name: 'Tujuan 2: Keandalan Laporan Keuangan (BPKAD)', code: 'KK3.2' },
  { id: 'T3', name: 'Tujuan 3: Pengamanan Aset Daerah (BPKAD)', code: 'KK3.3' },
  { id: 'T4', name: 'Tujuan 4: Ketaatan pada Peraturan (Inspektorat)', code: 'KK3.4' }
];

const SUBELEMENTS = [
  '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8',
  '2.1', '2.2',
  '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11',
  '4.1', '4.2',
  '5.1', '5.2'
];

const SUBELEMENT_LABELS = {
  '1.1': 'Penegakan Integritas dan Nilai Etika',
  '1.2': 'Komitmen terhadap Kompetensi',
  '1.3': 'Kepemimpinan yang Kondusif',
  '1.4': 'Struktur Organisasi Sesuai Kebutuhan',
  '1.5': 'Pendelegasian Wewenang & Tanggung Jawab',
  '1.6': 'Kebijakan Pembinaan SDM yang Sehat',
  '1.7': 'Perwujudan Peran APIP yang Efektif',
  '1.8': 'Hubungan Kerja dengan Instansi Terkait',
  '2.1': 'Identifikasi Risiko',
  '2.2': 'Analisis Risiko',
  '3.1': 'Reviu atas Kinerja Instansi',
  '3.2': 'Pembinaan Sumber Daya Manusia',
  '3.3': 'Pengendalian Sistem Informasi',
  '3.4': 'Pengendalian Fisik atas Aset',
  '3.5': 'Penetapan & Reviu Indikator Kinerja',
  '3.6': 'Pemisahan Fungsi',
  '3.7': 'Otorisasi Transaksi & Kejadian Penting',
  '3.8': 'Pencatatan Akurat & Tepat Waktu',
  '3.9': 'Pembatasan Akses Sumber Daya',
  '3.10': 'Akuntabilitas Aset & Pencatatan',
  '3.11': 'Dokumentasi Sistem Pengendalian Intern',
  '4.1': 'Informasi yang Relevan',
  '4.2': 'Komunikasi yang Efektif',
  '5.1': 'Pemantauan Berkelanjutan',
  '5.2': 'Evaluasi Terpisah'
};

const GRADE_LEVELS = {
  E: 'Lvl 1 (Rintisan)',
  D: 'Lvl 2 (Berkembang)',
  C: 'Lvl 3 (Terdefinisi)',
  B: 'Lvl 4 (Terkelola)',
  A: 'Lvl 5 (Optimum)'
};

const GRADE_COLORS = {
  E: 'bg-red-50 text-red-700 border-red-150',
  D: 'bg-orange-50 text-orange-700 border-orange-150',
  C: 'bg-amber-50 text-amber-700 border-amber-150',
  B: 'bg-blue-50 text-blue-700 border-blue-150',
  A: 'bg-emerald-50 text-emerald-700 border-emerald-150'
};

export default function VerificationPanel({ profile }) {
  const [activePillar, setActivePillar] = useState('T1');
  const [activeSubelement, setActiveSubelement] = useState('1.1');
  const [opdList, setOpdList] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifyingItem, setVerifyingItem] = useState(null);

  // Form states for verification
  const [verifiedGrade, setVerifiedGrade] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const userRole = profile?.role || 'OPD';

  useEffect(() => {
    // Auto-select corresponding pillar based on role to ease UX
    if (userRole === 'BAPPEDA') setActivePillar('T1');
    if (userRole === 'BPKAD') setActivePillar('T2');
    if (userRole === 'INSPEKTORAT') setActivePillar('T4');
  }, [userRole]);

  useEffect(() => {
    fetchOPDsAndAssessments();
  }, [activePillar, activeSubelement]);

  const fetchOPDsAndAssessments = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch all OPDs
      const { data: opds, error: opdsErr } = await supabase
        .from('ref_opd')
        .select('*')
        .order('id', { ascending: true });
      if (opdsErr) throw opdsErr;
      setOpdList(opds || []);

      // 2. Fetch all assessments for this pillar & subelement
      const { data: asses, error: assesErr } = await supabase
        .from('trx_subelement_assessment')
        .select('*')
        .eq('fiscal_year', 2026)
        .eq('pillar_type', activePillar)
        .eq('subelement_code', activeSubelement)
        .eq('parameter_no', 1);
      if (assesErr) throw assesErr;
      setAssessments(asses || []);

    } catch (err) {
      console.error('Error fetching verification panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerify = (opd, currentAsses) => {
    setVerifyingItem({ opd, currentAsses });
    setVerifiedGrade(currentAsses?.verified_grade || currentAsses?.opd_grade || 'C');
    setVerificationNotes(currentAsses?.verification_notes || '');
  };

  const handleSaveVerification = async () => {
    if (!verifyingItem) return;
    const { opd, currentAsses } = verifyingItem;
    
    try {
      setSaving(true);

      const payload = {
        opd_id: opd.id,
        fiscal_year: 2026,
        pillar_type: activePillar,
        subelement_code: activeSubelement,
        parameter_no: 1,
        verified_grade: verifiedGrade,
        verified_by_user_id: profile.id,
        verification_notes: verificationNotes,
        status_flow: 'BAPPEDA_VERIFY' // verified status
      };

      let error;
      if (currentAsses && currentAsses.id) {
        const { error: err } = await supabase
          .from('trx_subelement_assessment')
          .update(payload)
          .eq('id', currentAsses.id);
        error = err;
      } else {
        // If OPD hasn't filled it out, coordinator can still pre-seed/override it
        payload.opd_grade = 'E'; // fallback self-assess grade
        payload.opd_uraian = 'Dibuat oleh verifikator daerah';
        const { error: err } = await supabase
          .from('trx_subelement_assessment')
          .insert([payload]);
        error = err;
      }

      if (error) throw error;
      alert('Override Penilaian & Catatan Verifikasi disimpan!');
      setVerifyingItem(null);
      fetchOPDsAndAssessments();
    } catch (err) {
      console.error('Error saving verification:', err);
      alert(err.message || 'Gagal menyimpan hasil verifikasi.');
    } finally {
      setSaving(false);
    }
  };

  const getOPDAssessment = (opdId) => {
    return assessments.find(a => a.opd_id === opdId);
  };

  // Determine if user has access to modify the selected pillar
  const isAuthorizedPillar = 
    userRole === 'ADMIN' || 
    userRole === 'INSPEKTORAT' || // Inspektorat can QA all sheets
    (activePillar === 'T1' && userRole === 'BAPPEDA') ||
    ((activePillar === 'T2' || activePillar === 'T3') && userRole === 'BPKAD');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Panel Verifikasi Pemda & Audit Penilaian</h1>
          <p className="text-sm text-slate-500 mt-1">Review hasil penilaian mandiri dari seluruh OPD, berikan verifikasi akhir, dan terapkan nilai koreksi (override).</p>
        </div>
      </div>

      {/* Pillar Selection Tabs */}
      <div className="flex border border-slate-200/60 mb-6 bg-white p-1 rounded-xl shadow-sm space-x-1">
        {PILLARS.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePillar(p.id)}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all duration-200 ${
              activePillar === p.id 
                ? 'bg-sky-600 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Subelement selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subunsur Evaluasi</label>
          <select
            value={activeSubelement}
            onChange={(e) => setActiveSubelement(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
          >
            {SUBELEMENTS.map(code => (
              <option key={code} value={code}>
                {code} - {SUBELEMENT_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
        <div className="px-4 py-2 bg-sky-50 rounded-lg text-xs text-sky-700 flex items-center space-x-2 border border-sky-100/50">
          <ShieldAlert size={16} />
          <span className="font-semibold">
            {isAuthorizedPillar ? 'Anda memiliki izin verifikasi untuk halaman ini.' : 'Hanya baca (Read-only). Halaman ini milik tim Pemda terkait.'}
          </span>
        </div>
      </div>

      {/* Main Grid table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="p-4 w-[40px]">No</th>
              <th className="p-4 w-[250px]">Nama OPD</th>
              <th className="p-4 w-[100px] text-center">Grade Mandiri</th>
              <th className="p-4">Hasil Pengujian OPD</th>
              <th className="p-4 w-[100px] text-center">Grade Pemda</th>
              <th className="p-4 w-[100px] text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent"></div>
                    <span>Memuat data verifikasi...</span>
                  </div>
                </td>
              </tr>
            ) : (
              opdList.map((opd, i) => {
                const ass = getOPDAssessment(opd.id);
                const selfGrade = ass?.opd_grade;
                const verifiedGrade = ass?.verified_grade;

                return (
                  <tr key={opd.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-xs text-slate-400 font-semibold">{i + 1}</td>
                    <td className="p-4">
                      <span className="text-xs font-semibold text-slate-800 leading-normal block">{opd.name_opd}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{opd.code_opd}</span>
                    </td>
                    <td className="p-4 text-center">
                      {selfGrade ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${GRADE_COLORS[selfGrade]}`}>
                          {selfGrade}
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-400">Belum diisi</span>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed" title={ass?.opd_uraian}>
                        {ass?.opd_uraian || '-'}
                      </p>
                      {ass?.verification_notes && (
                        <div className="mt-1.5 p-2 bg-sky-50 rounded border border-sky-100/50 text-[10px] text-sky-700 leading-relaxed">
                          <strong>Catatan Verifikator:</strong> {ass.verification_notes}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {verifiedGrade ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${GRADE_COLORS[verifiedGrade]}`}>
                          {verifiedGrade}
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-400">Sama</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenVerify(opd, ass)}
                        disabled={!isAuthorizedPillar}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all duration-200 flex items-center justify-center space-x-1 mx-auto ${
                          isAuthorizedPillar
                            ? 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-600 shadow-sm'
                            : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        <Edit3 size={12} />
                        <span>Verifikasi</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: VERIFY DIALOG */}
      {verifyingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
                  <UserCheck size={16} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Evaluasi Verifikator: {verifyingItem.opd.name_opd}
                </h3>
              </div>
              <button 
                onClick={() => setVerifyingItem(null)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Batal
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hasil Pengujian OPD</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {verifyingItem.currentAsses?.opd_uraian || 'OPD belum mengisi berkas evaluasi mandiri.'}
                </p>
                {verifyingItem.currentAsses?.opd_grade && (
                  <div className="mt-2 text-xs flex items-center space-x-1.5">
                    <span className="text-slate-500">Nilai yang diajukan:</span>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase ${GRADE_COLORS[verifyingItem.currentAsses.opd_grade]}`}>
                      {verifyingItem.currentAsses.opd_grade}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Tentukan Grade Koreksi (Verified Grade)</label>
                <select
                  value={verifiedGrade}
                  onChange={(e) => setVerifiedGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                >
                  {Object.entries(GRADE_LEVELS).map(([k, v]) => (
                    <option key={k} value={k}>{k} - {v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Catatan Verifikasi / Alasan Penyesuaian</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Tuliskan justifikasi koreksi nilai atau masukan perbaikan untuk OPD..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveVerification}
                className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? 'Menyimpan...' : 'Simpan Verifikasi & Override'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
