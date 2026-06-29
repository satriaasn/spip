import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CheckCircle, AlertTriangle, HelpCircle, Save, Layers, ShieldCheck } from 'lucide-react';

const COSO_COMPONENTS = [
  { id: '1', name: 'Lingkungan Pengendalian', subelements: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'] },
  { id: '2', name: 'Penilaian Risiko', subelements: ['2.1', '2.2'] },
  { id: '3', name: 'Kegiatan Pengendalian', subelements: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11'] },
  { id: '4', name: 'Informasi & Komunikasi', subelements: ['4.1', '4.2'] },
  { id: '5', name: 'Pemantauan', subelements: ['5.1', '5.2'] }
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

const SUBELEMENT_PARAMETERS = {
  '1.1': 1, '1.2': 1, '1.3': 1, '1.4': 1, '1.5': 1, '1.6': 2, '1.7': 1, '1.8': 2,
  '2.1': 3, '2.2': 5,
  '3.1': 1, '3.2': 1, '3.3': 1, '3.4': 1, '3.5': 1, '3.6': 1, '3.7': 1, '3.8': 1, '3.9': 1, '3.10': 1, '3.11': 1,
  '4.1': 4, '4.2': 1,
  '5.1': 3, '5.2': 2
};

const PILLARS = [
  { id: 'T1', name: 'Tujuan 1: Efektivitas & Efisiensi (2E)', code: 'KK3.1' },
  { id: 'T2', name: 'Tujuan 2: Keandalan Laporan Keuangan', code: 'KK3.2' },
  { id: 'T3', name: 'Tujuan 3: Pengamanan Aset Daerah', code: 'KK3.3' },
  { id: 'T4', name: 'Tujuan 4: Ketaatan pada Peraturan', code: 'KK3.4' }
];

const REF_GRADES = [
  { value: 'E', label: 'Rintisan (Grade 1)', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'D', label: 'Berkembang (Grade 2)', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 'C', label: 'Terdefinisi (Grade 3)', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'B', label: 'Terkelola (Grade 4)', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'A', label: 'Optimum (Grade 5)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];

export default function SubelementAssessments({ profile, selectedYear }) {
  const [activePillar, setActivePillar] = useState('T1');
  const [activeComponent, setActiveComponent] = useState('1');
  const [activeSubelement, setActiveSubelement] = useState('1.1');
  const [activeParameter, setActiveParameter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Assessment fields
  const [opdUraian, setOpdUraian] = useState('');
  const [opdGrade, setOpdGrade] = useState('');
  const [opdAoiCluster, setOpdAoiCluster] = useState('');
  const [opdAoiDesc, setOpdAoiDesc] = useState('');
  const [opdCauseCluster, setOpdCauseCluster] = useState('');
  const [opdCauseDesc, setOpdCauseDesc] = useState('');

  // Dropdown reference options
  const [refAoiOptions, setRefAoiOptions] = useState([]);
  const [refCauseOptions, setRefCauseOptions] = useState([]);

  // OPD list and scope selection
  const [opds, setOpds] = useState([]);
  const [selectedOpdId, setSelectedOpdId] = useState('');
  const userRole = profile?.role || 'OPD';

  useEffect(() => {
    fetchOPDs();
  }, [selectedYear]);

  useEffect(() => {
    if (profile?.opd_id) {
      setSelectedOpdId(String(profile.opd_id));
    }
  }, [profile]);

  useEffect(() => {
    setActiveParameter(1);
  }, [activeSubelement]);

  useEffect(() => {
    const comp = COSO_COMPONENTS.find(c => c.id === activeComponent);
    if (comp && comp.subelements.length > 0) {
      setActiveSubelement(comp.subelements[0]);
    }
  }, [activeComponent]);

  useEffect(() => {
    if (selectedOpdId) {
      fetchAssessment();
    }
    fetchRefOptions();
  }, [activePillar, activeSubelement, activeParameter, selectedOpdId, selectedYear]);

  const fetchOPDs = async () => {
    try {
      const { data } = await supabase.from('ref_opd').select('*').order('id');
      setOpds(data || []);
      if (data && data.length > 0 && !profile?.opd_id) {
        setSelectedOpdId(String(data[0].id));
      }
    } catch (err) {
      console.error('Error fetching OPD list:', err);
    }
  };

  const fetchRefOptions = async () => {
    try {
      const { data } = await supabase.from('trx_subelement_assessment').select('opd_aoi_cluster, opd_cause_cluster').limit(100);
      
      // Default fallback categories
      const aoiCats = new Set([
        "Kebijakan belum selaras",
        "Implementasi belum konsisten",
        "Dokumentasi pendukung kurang memadai",
        "Evaluasi berkala belum dilaksanakan"
      ]);
      const causeCats = new Set(["Man", "Method", "Money", "Material", "Machine"]);

      if (data) {
        data.forEach(item => {
          if (item.opd_aoi_cluster) aoiCats.add(item.opd_aoi_cluster);
          if (item.opd_cause_cluster) causeCats.add(item.opd_cause_cluster);
        });
      }
      setRefAoiOptions(Array.from(aoiCats));
      setRefCauseOptions(Array.from(causeCats));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssessment = async () => {
    if (!selectedOpdId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('trx_subelement_assessment')
        .select('*')
        .eq('opd_id', parseInt(selectedOpdId))
        .eq('fiscal_year', selectedYear)
        .eq('pillar_type', activePillar)
        .eq('subelement_code', activeSubelement)
        .eq('parameter_no', activeParameter)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setOpdUraian(data.opd_uraian || '');
        setOpdGrade(data.opd_grade || 'C');
        setOpdAoiCluster(data.opd_aoi_cluster || '');
        setOpdAoiDesc(data.opd_aoi_desc || '');
        setOpdCauseCluster(data.opd_cause_cluster || '');
        setOpdCauseDesc(data.opd_cause_desc || '');
      } else {
        // Reset to default
        setOpdUraian('');
        setOpdGrade('C');
        setOpdAoiCluster('');
        setOpdAoiDesc('');
        setOpdCauseCluster('');
        setOpdCauseDesc('');
      }
    } catch (err) {
      console.error('Error fetching subelement assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedOpdId) {
      alert('Mohon pilih instansi OPD terlebih dahulu.');
      return;
    }

    try {
      setSaving(true);
      
      // Check existing row
      const { data: existing } = await supabase
        .from('trx_subelement_assessment')
        .select('id')
        .eq('opd_id', parseInt(selectedOpdId))
        .eq('fiscal_year', selectedYear)
        .eq('pillar_type', activePillar)
        .eq('subelement_code', activeSubelement)
        .eq('parameter_no', activeParameter)
        .single();

      const payload = {
        opd_id: parseInt(selectedOpdId),
        fiscal_year: selectedYear,
        pillar_type: activePillar,
        subelement_code: activeSubelement,
        parameter_no: activeParameter,
        opd_uraian: opdUraian,
        opd_grade: opdGrade,
        opd_aoi_cluster: opdGrade !== 'A' ? opdAoiCluster : null,
        opd_aoi_desc: opdGrade !== 'A' ? opdAoiDesc : null,
        opd_cause_cluster: opdGrade !== 'A' ? opdCauseCluster : null,
        opd_cause_desc: opdGrade !== 'A' ? opdCauseDesc : null,
        status_flow: 'OPD_DRAFT'
      };

      let error;
      if (existing) {
        const { error: err } = await supabase
          .from('trx_subelement_assessment')
          .update(payload)
          .eq('id', existing.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('trx_subelement_assessment')
          .insert([payload]);
        error = err;
      }

      if (error) throw error;
      alert('Penilaian Mandiri Subelement berhasil disimpan!');
    } catch (err) {
      console.error('Error saving subelement:', err);
      alert(err.message || 'Gagal menyimpan Penilaian Mandiri.');
    } finally {
      setSaving(false);
    }
  };

  const compData = COSO_COMPONENTS.find(c => c.id === activeComponent);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Header with Selector */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Penilaian Mandiri Subelement (KK3.1 - KK3.4)</h1>
          <p className="text-sm text-slate-500 mt-1">Evaluasi 25 subunsur lingkungan pengendalian dan proses manajemen internal instansi Anda.</p>
        </div>

        {/* OPD Selector for coordinators */}
        {['ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT'].includes(userRole) && (
          <div className="flex items-center space-x-2.5 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Mengisi atas nama:</span>
            <select
              value={selectedOpdId}
              onChange={(e) => setSelectedOpdId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {opds.map(opd => (
                <option key={opd.id} value={opd.id}>{opd.name_opd}</option>
              ))}
            </select>
          </div>
        )}
      </div>


      {/* Pillar Tabs */}
      <div className="flex border-b border-slate-200 mb-6 bg-white p-1.5 rounded-xl shadow-sm space-x-1">
        {PILLARS.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePillar(p.id)}
            className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-lg transition-all duration-200 ${
              activePillar === p.id 
                ? 'bg-sky-600 text-white shadow' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Layout Split: Sidebar for Components/Subelements, Right for Form */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Navigation (COSO Components & Subelements) */}
        <div className="col-span-4 space-y-6">
          
          {/* COSO Components Dropdown */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Komponen COSO/SPIP</label>
            <select
              value={activeComponent}
              onChange={(e) => setActiveComponent(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
            >
              {COSO_COMPONENTS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subelements list */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-xs flex items-center">
                <Layers size={14} className="mr-1.5 text-slate-500" />
                Daftar Subunsur
              </h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
              {compData?.subelements.map(code => (
                <button
                  key={code}
                  onClick={() => setActiveSubelement(code)}
                  className={`w-full text-left p-3.5 text-xs transition-all duration-200 flex items-start space-x-2.5 ${
                    activeSubelement === code 
                      ? 'bg-sky-50/60 font-semibold text-sky-700 border-r-2 border-sky-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                    {code}
                  </span>
                  <span className="flex-1 leading-normal line-clamp-2">
                    {SUBELEMENT_LABELS[code]}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Form panel */}
        <div className="col-span-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            
            <div className="border-b border-slate-100 pb-5 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider bg-sky-500/10 text-sky-600">
                  Subunsur {activeSubelement}
                </span>
                <h2 className="font-bold text-slate-800 text-base mt-1">
                  {SUBELEMENT_LABELS[activeSubelement]}
                </h2>
              </div>
            </div>

            {/* Parameter selection tabs */}
            {SUBELEMENT_PARAMETERS[activeSubelement] > 1 && (
              <div className="mb-6 p-1 bg-slate-50 border border-slate-200/60 rounded-xl flex space-x-1">
                {Array.from({ length: SUBELEMENT_PARAMETERS[activeSubelement] }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setActiveParameter(num)}
                    className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all duration-200 ${
                      activeParameter === num
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                    }`}
                  >
                    Parameter {num}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-500 border-t-transparent"></div>
                  <p className="text-xs text-slate-500">Mengambil detail penilaian...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* 1. Uraian Hasil Pengujian */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Uraian Hasil Pengujian / Bukti Nyata</label>
                  <textarea
                    required
                    rows="5"
                    placeholder="Tuliskan uraian pengujian, bukti dokumentasi (URL), implementasi SOP, serta hasil evaluasi internal di instansi Anda..."
                    value={opdUraian}
                    onChange={(e) => setOpdUraian(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                  />
                </div>

                {/* 2. Grade Selection Cards */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Nilai Capaian (Grade)</label>
                  <div className="grid grid-cols-5 gap-3">
                    {REF_GRADES.map(grade => (
                      <button
                        key={grade.value}
                        type="button"
                        onClick={() => setOpdGrade(grade.value)}
                        className={`p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center space-y-1.5 ${
                          opdGrade === grade.value 
                            ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/10' 
                            : 'bg-white border-slate-200 hover:border-sky-200 hover:bg-sky-50/20'
                        }`}
                      >
                        <span className="text-lg font-bold">{grade.value}</span>
                        <span className={`text-[8px] font-semibold px-1 rounded uppercase truncate max-w-full ${
                          opdGrade === grade.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {grade.value === 'A' ? 'Lvl 5' : grade.value === 'B' ? 'Lvl 4' : grade.value === 'C' ? 'Lvl 3' : grade.value === 'D' ? 'Lvl 2' : 'Lvl 1'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show AoI and Cause inputs ONLY if Grade is not 'A' (Optimum) */}
                {opdGrade !== 'A' && (
                  <div className="grid grid-cols-2 gap-6 pt-5 border-t border-slate-100 animate-in slide-in-from-top-3 duration-250">
                    
                    {/* Area of Improvement (AoI) */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-[10px] text-slate-700 uppercase tracking-wider flex items-center">
                        <AlertTriangle size={14} className="mr-1 text-amber-500" />
                        Area of Improvement (AoI)
                      </h4>
                      <div className="space-y-2">
                        <select
                          value={opdAoiCluster}
                          onChange={(e) => setOpdAoiCluster(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="">Pilih Klaster AoI...</option>
                          {refAoiOptions.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <textarea
                          rows="3"
                          placeholder="Detail uraian perbaikan kualitas yang direncanakan..."
                          value={opdAoiDesc}
                          onChange={(e) => setOpdAoiDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                        />
                      </div>
                    </div>

                    {/* Cause (Penyebab) */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-[10px] text-slate-700 uppercase tracking-wider flex items-center">
                        <HelpCircle size={14} className="mr-1 text-sky-500" />
                        Penyebab Kelemahan (5M)
                      </h4>
                      <div className="space-y-2">
                        <select
                          value={opdCauseCluster}
                          onChange={(e) => setOpdCauseCluster(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="">Pilih Klaster Penyebab...</option>
                          {refCauseOptions.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <textarea
                          rows="3"
                          placeholder="Uraian akar permasalahan di lapangan..."
                          value={opdCauseDesc}
                          onChange={(e) => setOpdCauseDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Penilaian Mandiri'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
