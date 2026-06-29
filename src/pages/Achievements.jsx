import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Save, Plus, Trash2, FileCheck, BarChart3, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

const SHEETS = [
  { id: 'kk51a', name: 'KK 5.1 A (Capaian Pemda)', dbType: 'KK5.1A', roles: ['BAPPEDA', 'ADMIN', 'OPD'] },
  { id: 'kk51b', name: 'KK 5.1 B (Capaian OPD)', dbType: 'KK5.1B', roles: ['BAPPEDA', 'ADMIN', 'OPD'] },
  { id: 'kk52', name: 'KK 5.2 (Capaian Output)', dbType: 'KK5.2', roles: ['BAPPEDA', 'ADMIN', 'OPD'] },
  { id: 'kk6', name: 'KK 6 (Pelaporan Keuangan)', dbType: 'KK6', roles: ['BPKAD', 'ADMIN'] },
  { id: 'kk7', name: 'KK 7 (Pengamanan Aset)', dbType: 'KK7', roles: ['BPKAD', 'ADMIN'] },
  { id: 'kk8', name: 'KK 8 (Ketaatan & Korupsi)', dbType: 'KK8', roles: ['INSPEKTORAT', 'ADMIN'] }
];

export default function Achievements({ profile, selectedYear }) {
  const [activeTab, setActiveTab] = useState('kk51a');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Table rows and summary payload loaded from DB
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [opds, setOpds] = useState([]);

  const userRole = profile?.role || 'OPD';

  useEffect(() => {
    // Select default tab based on role
    if (userRole === 'BAPPEDA' || userRole === 'OPD') setActiveTab('kk51a');
    else if (userRole === 'BPKAD') setActiveTab('kk6');
    else if (userRole === 'INSPEKTORAT') setActiveTab('kk8');
    
    fetchOPDs();
  }, [userRole]);

  useEffect(() => {
    fetchAchievementData();
  }, [activeTab, selectedYear]);

  const fetchOPDs = async () => {
    try {
      const { data } = await supabase.from('ref_opd').select('*').order('id');
      setOpds(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAchievementData = async () => {
    try {
      setLoading(true);
      const activeSheet = SHEETS.find(s => s.id === activeTab);
      if (!activeSheet) return;

      const { data, error } = await supabase
        .from('trx_achievement_assessment')
        .select('*')
        .eq('fiscal_year', selectedYear)
        .eq('kk_type', activeSheet.dbType)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.data_payload) {
        setRows(data.data_payload.rows || []);
        setSummary(data.data_payload.summary || {});
      } else {
        setRows([]);
        setSummary(getDefaultSummary(activeSheet.dbType));
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSummary = (dbType) => {
    switch (dbType) {
      case 'KK5.1A': return { pemda_outcome: 'B' };
      case 'KK5.1B': return { opd_outcome: 'B' };
      case 'KK5.2': return { output: 'C' };
      case 'KK6': return { opini_2025: 'WTP', opini_2024: 'WTP', temuan_count: 5, temuan_rupiah: '9243014000' };
      case 'KK7': return { kondisi_baik: '98', temuan_aset: 'C', uraian_aset: 'Aset dikuasai pihak lain berupa tanah belum optimal.' };
      case 'KK8': return { temuan_count: 14, korupsi: 'Tidak' };
      default: return {};
    }
  };

  const handleCellChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSummaryChange = (field, value) => {
    setSummary(prev => ({ ...prev, [field]: value }));
  };

  const addRow = () => {
    const activeSheet = SHEETS.find(s => s.id === activeTab);
    const newRow = getNewRowTemplate(activeSheet.dbType);
    setRows([...rows, newRow]);
  };

  const deleteRow = (index) => {
    const updated = rows.filter((_, idx) => idx !== index);
    setRows(updated);
  };

  const getNewRowTemplate = (dbType) => {
    const baseNo = String(rows.length + 1);
    switch (dbType) {
      case 'KK5.1A':
        return { no: baseNo, sasaran: '', indikator: '', sasaranTepat: 'Y', ikTepat: 'Y', dataAndal: 'Y', pm: 'Y', target: '', realisasi: '', persentase: '', nilai: '' };
      case 'KK5.1B':
        return { no: baseNo, sasaranPemda: '', opdName: '', sasaranOpd: '', indikatorOpd: '', target: '', realisasi: '', relevan: 'Y', sasaranTepat: 'Y', ikTepat: 'Y', dataAndal: 'Y', pm: 'Y' };
      case 'KK5.2':
        return { no: baseNo, sasaranPemda: '', opdName: '', sasaranOpd: '', sasaranProgram: '', programName: '', outputName: '' };
      case 'KK6':
        return { no: baseNo, opini2025: 'WTP', klasifikasi2025: '', uraian2025: '', nilai2025: '', penyebab2025: '', subunsur2025: '', opini2024: 'WTP', klasifikasi2024: '', uraian2024: '', nilai2024: '', penyebab2024: '', subunsur2024: '' };
      case 'KK7':
        return { no: baseNo, opini2025: 'WTP', kondisiBaik2025: '100', klasifikasi2025: '', uraian2025: '', nilai2025: '', penyebab2025: '', subunsur2025: '', opini2024: 'WTP', kondisiBaik2024: '100', klasifikasi2024: '', uraian2024: '', nilai2024: '' };
      case 'KK8':
        return { no: baseNo, opini2025: 'WTP', klasifikasi2025: '', uraian2025: '', nilai2025: '', penyebab2025: '', subunsur2025: '', opini2024: 'WTP', klasifikasi2024: '', uraian2024: '', nilai2024: '', penyebab2024: '', subunsur2024: '' };
      default:
        return {};
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const activeSheet = SHEETS.find(s => s.id === activeTab);
      
      const payload = {
        rows,
        summary
      };

      // Check existing row
      const { data: existing } = await supabase
        .from('trx_achievement_assessment')
        .select('id')
        .eq('fiscal_year', selectedYear)
        .eq('kk_type', activeSheet.dbType)
        .single();

      let error;
      if (existing) {
        const { error: err } = await supabase
          .from('trx_achievement_assessment')
          .update({ data_payload: payload })
          .eq('id', existing.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('trx_achievement_assessment')
          .insert([{ fiscal_year: selectedYear, kk_type: activeSheet.dbType, data_payload: payload }]);
        error = err;
      }

      if (error) throw error;
      alert(`Data Kertas Kerja ${activeSheet.name} berhasil disimpan!`);
      fetchAchievementData();
    } catch (err) {
      console.error('Error saving achievement data:', err);
      alert(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const activeSheet = SHEETS.find(s => s.id === activeTab);
  const isAuthorized = activeSheet?.roles.includes(userRole);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Evaluasi Capaian & Hasil (KK5.1 - KK8)</h1>
          <p className="text-sm text-slate-500 mt-1">Rincian kertas kerja penilaian mandiri untuk mengukur efektivitas perbaikan tata kelola regional.</p>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex border border-slate-200/60 bg-white p-1 rounded-xl shadow-sm space-x-1 overflow-x-auto">
        {SHEETS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`flex-1 min-w-[120px] py-2.5 text-center text-xs font-bold rounded-lg transition-all duration-200 ${
              activeTab === s.id 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Authorization Alert */}
      {!isAuthorized ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-xl flex items-center space-x-3">
          <AlertTriangle size={24} className="text-amber-600" />
          <div>
            <h3 className="font-bold text-sm">Mode Pratinjau (ReadOnly)</h3>
            <p className="text-xs mt-0.5">Peran Anda ({userRole}) tidak memiliki otorisasi untuk mengedit lembar kerja ini. Anda hanya dapat melihat data.</p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SUMMARY METRICS BLOCK */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Simpulan Lembar Kerja &amp; Parameter Dashboard</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTab === 'kk51a' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grade Capaian Sasaran Pemda</label>
                <select
                  disabled={!isAuthorized}
                  value={summary.pemda_outcome || 'B'}
                  onChange={(e) => handleSummaryChange('pemda_outcome', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                >
                  <option value="A">Grade A (Capaian ≥ 90%)</option>
                  <option value="B">Grade B (Capaian 70% s.d 89%)</option>
                  <option value="C">Grade C (Capaian 50% s.d 69%)</option>
                  <option value="D">Grade D (Capaian 30% s.d 49%)</option>
                  <option value="E">Grade E (Capaian &lt; 30%)</option>
                </select>
              </div>
            )}

            {activeTab === 'kk51b' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grade Capaian Sasaran OPD</label>
                <select
                  disabled={!isAuthorized}
                  value={summary.opd_outcome || 'B'}
                  onChange={(e) => handleSummaryChange('opd_outcome', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                >
                  <option value="A">Grade A (Capaian ≥ 90%)</option>
                  <option value="B">Grade B (Capaian 70% s.d 89%)</option>
                  <option value="C">Grade C (Capaian 50% s.d 69%)</option>
                  <option value="D">Grade D (Capaian 30% s.d 49%)</option>
                  <option value="E">Grade E (Capaian &lt; 30%)</option>
                </select>
              </div>
            )}

            {activeTab === 'kk52' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grade Capaian Output</label>
                <select
                  disabled={!isAuthorized}
                  value={summary.output || 'C'}
                  onChange={(e) => handleSummaryChange('output', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                >
                  <option value="A">Grade A (Capaian ≥ 90%)</option>
                  <option value="B">Grade B (Capaian 70% s.d 89%)</option>
                  <option value="C">Grade C (Capaian 50% s.d 69%)</option>
                  <option value="D">Grade D (Capaian 30% s.d 49%)</option>
                  <option value="E">Grade E (Capaian &lt; 30%)</option>
                </select>
              </div>
            )}

            {activeTab === 'kk6' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Opini BPK RI 2025</label>
                  <select
                    disabled={!isAuthorized}
                    value={summary.opini_2025 || 'WTP'}
                    onChange={(e) => handleSummaryChange('opini_2025', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                  >
                    <option value="WTP">WTP (Wajar Tanpa Pengecualian)</option>
                    <option value="WDP">WDP (Wajar Dengan Pengecualian)</option>
                    <option value="TW">TW (Tidak Wajar)</option>
                    <option value="TMP">TMP (Tidak Memberikan Pendapat)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jumlah Temuan Kelemahan SPI</label>
                  <input
                    disabled={!isAuthorized}
                    type="number"
                    value={summary.temuan_count || 0}
                    onChange={(e) => handleSummaryChange('temuan_count', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nilai Temuan Kerugian Daerah (Rp)</label>
                  <input
                    disabled={!isAuthorized}
                    type="text"
                    value={summary.temuan_rupiah || '0'}
                    onChange={(e) => handleSummaryChange('temuan_rupiah', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                  />
                </div>
              </>
            )}

            {activeTab === 'kk7' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">BMN Kondisi Baik (%)</label>
                  <input
                    disabled={!isAuthorized}
                    type="number"
                    value={summary.kondisi_baik || 90}
                    onChange={(e) => handleSummaryChange('kondisi_baik', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grade Permasalahan Aset</label>
                  <select
                    disabled={!isAuthorized}
                    value={summary.temuan_aset || 'C'}
                    onChange={(e) => handleSummaryChange('temuan_aset', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                  >
                    <option value="A">Grade A (Bebas Masalah Aset 5 Thn)</option>
                    <option value="B">Grade B (Bebas Masalah Aset 3 Thn)</option>
                    <option value="C">Grade C (Bebas Masalah Aset 2 Thn)</option>
                    <option value="D">Grade D (Masalah Aset 2 Thn Terakhir)</option>
                    <option value="E">Grade E (Banyak Aset Bermasalah Hukum)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Uraian Catatan Aset</label>
                  <input
                    disabled={!isAuthorized}
                    type="text"
                    value={summary.uraian_aset || ''}
                    onChange={(e) => handleSummaryChange('uraian_aset', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                  />
                </div>
              </>
            )}

            {activeTab === 'kk8' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jumlah Temuan Ketidakpatuhan</label>
                  <input
                    disabled={!isAuthorized}
                    type="number"
                    value={summary.temuan_count || 0}
                    onChange={(e) => handleSummaryChange('temuan_count', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kejadian Tindak Pidana Korupsi</label>
                  <select
                    disabled={!isAuthorized}
                    value={summary.korupsi || 'Tidak'}
                    onChange={(e) => handleSummaryChange('korupsi', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs p-2 text-white"
                  >
                    <option value="Tidak">Tidak Ada</option>
                    <option value="Ya">Ada Korupsi</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* DETAILED TABLES BLOCK */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              Data Tabel {activeSheet?.name}
            </h3>
            
            {isAuthorized && (
              <button
                type="button"
                onClick={addRow}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1"
              >
                <Plus size={12} />
                <span>Tambah Baris</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading rows...</div>
            ) : rows.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">Tabel Kosong. Silakan tambah baris baru.</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                
                {/* 1. TABLE: KK 5.1 A */}
                {activeTab === 'kk51a' && (
                  <>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-500 text-[10px] uppercase">
                        <th className="p-3 w-[60px] text-center">No</th>
                        <th className="p-3 w-[220px]">Sasaran Strategis Pemda</th>
                        <th className="p-3 w-[220px]">Indikator Kinerja</th>
                        <th className="p-3 w-[70px] text-center">Sastra Tepat</th>
                        <th className="p-3 w-[70px] text-center">IK Tepat</th>
                        <th className="p-3 w-[70px] text-center">Data Andal</th>
                        <th className="p-3 w-[70px] text-center">PM</th>
                        <th className="p-3 w-[90px] text-center">Target</th>
                        <th className="p-3 w-[90px] text-center">Realisasi</th>
                        <th className="p-3 w-[90px] text-center">Persentase</th>
                        <th className="p-3 w-[90px] text-center">Nilai Capaian</th>
                        {isAuthorized && <th className="p-3 w-[60px] text-center">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.no}
                              onChange={(e) => handleCellChange(idx, 'no', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.sasaran}
                              onChange={(e) => handleCellChange(idx, 'sasaran', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.indikator}
                              onChange={(e) => handleCellChange(idx, 'indikator', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <select
                              disabled={!isAuthorized}
                              value={row.sasaranTepat}
                              onChange={(e) => handleCellChange(idx, 'sasaranTepat', e.target.value)}
                              className="bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="Y">Y</option>
                              <option value="T">T</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <select
                              disabled={!isAuthorized}
                              value={row.ikTepat}
                              onChange={(e) => handleCellChange(idx, 'ikTepat', e.target.value)}
                              className="bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="Y">Y</option>
                              <option value="T">T</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <select
                              disabled={!isAuthorized}
                              value={row.dataAndal}
                              onChange={(e) => handleCellChange(idx, 'dataAndal', e.target.value)}
                              className="bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="Y">Y</option>
                              <option value="T">T</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <select
                              disabled={!isAuthorized}
                              value={row.pm}
                              onChange={(e) => handleCellChange(idx, 'pm', e.target.value)}
                              className="bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="Y">Y</option>
                              <option value="T">T</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.target}
                              onChange={(e) => handleCellChange(idx, 'target', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.realisasi}
                              onChange={(e) => handleCellChange(idx, 'realisasi', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.persentase}
                              onChange={(e) => handleCellChange(idx, 'persentase', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2 text-center font-semibold text-slate-800">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.nilai}
                              onChange={(e) => handleCellChange(idx, 'nilai', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          {isAuthorized && (
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => deleteRow(idx)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* 2. TABLE: KK 5.1 B */}
                {activeTab === 'kk51b' && (
                  <>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-500 text-[10px] uppercase">
                        <th className="p-3 w-[60px] text-center">No</th>
                        <th className="p-3 w-[150px]">Sasaran Pemda</th>
                        <th className="p-3 w-[150px]">Instansi OPD</th>
                        <th className="p-3 w-[150px]">Sasaran OPD</th>
                        <th className="p-3 w-[150px]">Indikator OPD</th>
                        <th className="p-3 w-[80px] text-center">Target</th>
                        <th className="p-3 w-[80px] text-center">Realisasi</th>
                        <th className="p-3 w-[60px] text-center">Relevan</th>
                        <th className="p-3 w-[60px] text-center">Sastra Tepat</th>
                        <th className="p-3 w-[60px] text-center">IK Tepat</th>
                        <th className="p-3 w-[60px] text-center">Data Andal</th>
                        <th className="p-3 w-[60px] text-center">PM</th>
                        {isAuthorized && <th className="p-3 w-[60px] text-center">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.no}
                              onChange={(e) => handleCellChange(idx, 'no', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.sasaranPemda}
                              onChange={(e) => handleCellChange(idx, 'sasaranPemda', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-1 focus:ring-sky-500 text-[11px]"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              disabled={!isAuthorized}
                              value={row.opdName}
                              onChange={(e) => handleCellChange(idx, 'opdName', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-1 focus:ring-sky-500 text-[11px]"
                            >
                              <option value="">Pilih OPD...</option>
                              {opds.map(o => <option key={o.id} value={o.name_opd}>{o.name_opd}</option>)}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.sasaranOpd}
                              onChange={(e) => handleCellChange(idx, 'sasaranOpd', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-1 focus:ring-sky-500 text-[11px]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.indikatorOpd}
                              onChange={(e) => handleCellChange(idx, 'indikatorOpd', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-1 focus:ring-sky-500 text-[11px]"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.target}
                              onChange={(e) => handleCellChange(idx, 'target', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.realisasi}
                              onChange={(e) => handleCellChange(idx, 'realisasi', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <select
                              disabled={!isAuthorized}
                              value={row.relevan}
                              onChange={(e) => handleCellChange(idx, 'relevan', e.target.value)}
                              className="bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="Y">Y</option>
                              <option value="T">T</option>
                            </select>
                          </td>
                          {['sasaranTepat', 'ikTepat', 'dataAndal', 'pm'].map(field => (
                            <td key={field} className="p-2 text-center">
                              <select
                                disabled={!isAuthorized}
                                value={row[field] || 'Y'}
                                onChange={(e) => handleCellChange(idx, field, e.target.value)}
                                className="bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                              >
                                <option value="Y">Y</option>
                                <option value="T">T</option>
                              </select>
                            </td>
                          ))}
                          {isAuthorized && (
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => deleteRow(idx)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* 3. TABLE: KK 5.2 */}
                {activeTab === 'kk52' && (
                  <>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-500 text-[10px] uppercase">
                        <th className="p-3 w-[60px] text-center">No</th>
                        <th className="p-3">Sasaran Pemda</th>
                        <th className="p-3">Instansi OPD</th>
                        <th className="p-3">Sasaran OPD</th>
                        <th className="p-3">Sasaran Program</th>
                        <th className="p-3">Nama Program</th>
                        <th className="p-3">Nama Output</th>
                        {isAuthorized && <th className="p-3 w-[60px] text-center">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.no}
                              onChange={(e) => handleCellChange(idx, 'no', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          {['sasaranPemda', 'opdName', 'sasaranOpd', 'sasaranProgram', 'programName', 'outputName'].map(field => (
                            <td key={field} className="p-2">
                              {field === 'opdName' ? (
                                <select
                                  disabled={!isAuthorized}
                                  value={row.opdName}
                                  onChange={(e) => handleCellChange(idx, 'opdName', e.target.value)}
                                  className="w-full bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                                >
                                  <option value="">Pilih OPD...</option>
                                  {opds.map(o => <option key={o.id} value={o.name_opd}>{o.name_opd}</option>)}
                                </select>
                              ) : (
                                <input
                                  disabled={!isAuthorized}
                                  type="text"
                                  value={row[field]}
                                  onChange={(e) => handleCellChange(idx, field, e.target.value)}
                                  className="w-full bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                                />
                              )}
                            </td>
                          ))}
                          {isAuthorized && (
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => deleteRow(idx)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* 4. TABLE: KK 6 */}
                {activeTab === 'kk6' && (
                  <>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-500 text-[10px] uppercase">
                        <th className="p-3 w-[50px] text-center" rowSpan="2">No</th>
                        <th className="p-3 text-center border-r border-slate-200" colSpan="6">Tahun 2025 (Evaluasi)</th>
                        <th className="p-3 text-center" colSpan="6">Tahun 2024 (LHP BPK)</th>
                        {isAuthorized && <th className="p-3 w-[50px] text-center" rowSpan="2">Aksi</th>}
                      </tr>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400 text-[9px] uppercase">
                        <th className="p-2">Opini</th>
                        <th className="p-2">Klasifikasi</th>
                        <th className="p-2">Uraian Temuan</th>
                        <th className="p-2">Rupiah</th>
                        <th className="p-2">Penyebab</th>
                        <th className="p-2 border-r border-slate-200">Sub Unsur</th>
                        <th className="p-2">Opini</th>
                        <th className="p-2">Klasifikasi</th>
                        <th className="p-2">Uraian Temuan</th>
                        <th className="p-2">Rupiah</th>
                        <th className="p-2">Penyebab</th>
                        <th className="p-2">Sub Unsur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-[11px]">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.no}
                              onChange={(e) => handleCellChange(idx, 'no', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          {/* 2025 columns */}
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.opini2025} onChange={(e) => handleCellChange(idx, 'opini2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.klasifikasi2025} onChange={(e) => handleCellChange(idx, 'klasifikasi2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.uraian2025} onChange={(e) => handleCellChange(idx, 'uraian2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.nilai2025} onChange={(e) => handleCellChange(idx, 'nilai2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.penyebab2025} onChange={(e) => handleCellChange(idx, 'penyebab2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input disabled={!isAuthorized} type="text" value={row.subunsur2025} onChange={(e) => handleCellChange(idx, 'subunsur2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          {/* 2024 columns */}
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.opini2024} onChange={(e) => handleCellChange(idx, 'opini2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.klasifikasi2024} onChange={(e) => handleCellChange(idx, 'klasifikasi2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.uraian2024} onChange={(e) => handleCellChange(idx, 'uraian2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.nilai2024} onChange={(e) => handleCellChange(idx, 'nilai2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.penyebab2024} onChange={(e) => handleCellChange(idx, 'penyebab2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.subunsur2024} onChange={(e) => handleCellChange(idx, 'subunsur2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          {isAuthorized && (
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => deleteRow(idx)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* 5. TABLE: KK 7 */}
                {activeTab === 'kk7' && (
                  <>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-500 text-[10px] uppercase">
                        <th className="p-3 w-[50px] text-center" rowSpan="2">No</th>
                        <th className="p-3 text-center border-r border-slate-200" colSpan="7">Tahun 2025 (Evaluasi)</th>
                        <th className="p-3 text-center" colSpan="5">Tahun 2024 (LHP BPK)</th>
                        {isAuthorized && <th className="p-3 w-[50px] text-center" rowSpan="2">Aksi</th>}
                      </tr>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400 text-[9px] uppercase">
                        <th className="p-2">Opini</th>
                        <th className="p-2">Kondisi Baik</th>
                        <th className="p-2">Klasifikasi</th>
                        <th className="p-2">Uraian Temuan</th>
                        <th className="p-2">Rupiah</th>
                        <th className="p-2">Penyebab</th>
                        <th className="p-2 border-r border-slate-200">Sub Unsur</th>
                        <th className="p-2">Opini</th>
                        <th className="p-2">Kondisi Baik</th>
                        <th className="p-2">Klasifikasi</th>
                        <th className="p-2">Uraian Temuan</th>
                        <th className="p-2">Rupiah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-[11px]">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.no}
                              onChange={(e) => handleCellChange(idx, 'no', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1"
                            />
                          </td>
                          {/* 2025 columns */}
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.opini2025} onChange={(e) => handleCellChange(idx, 'opini2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.kondisiBaik2025} onChange={(e) => handleCellChange(idx, 'kondisiBaik2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.klasifikasi2025} onChange={(e) => handleCellChange(idx, 'klasifikasi2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.uraian2025} onChange={(e) => handleCellChange(idx, 'uraian2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.nilai2025} onChange={(e) => handleCellChange(idx, 'nilai2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.penyebab2025} onChange={(e) => handleCellChange(idx, 'penyebab2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input disabled={!isAuthorized} type="text" value={row.subunsur2025} onChange={(e) => handleCellChange(idx, 'subunsur2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          {/* 2024 columns */}
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.opini2024} onChange={(e) => handleCellChange(idx, 'opini2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.kondisiBaik2024} onChange={(e) => handleCellChange(idx, 'kondisiBaik2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.klasifikasi2024} onChange={(e) => handleCellChange(idx, 'klasifikasi2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.uraian2024} onChange={(e) => handleCellChange(idx, 'uraian2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.nilai2024} onChange={(e) => handleCellChange(idx, 'nilai2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          {isAuthorized && (
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => deleteRow(idx)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* 6. TABLE: KK 8 */}
                {activeTab === 'kk8' && (
                  <>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-500 text-[10px] uppercase">
                        <th className="p-3 w-[50px] text-center" rowSpan="2">No</th>
                        <th className="p-3 text-center border-r border-slate-200" colSpan="6">Tahun 2025 (Evaluasi)</th>
                        <th className="p-3 text-center" colSpan="6">Tahun 2024 (LHP BPK)</th>
                        {isAuthorized && <th className="p-3 w-[50px] text-center" rowSpan="2">Aksi</th>}
                      </tr>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400 text-[9px] uppercase">
                        <th className="p-2">Opini</th>
                        <th className="p-2">Klasifikasi</th>
                        <th className="p-2">Uraian Temuan</th>
                        <th className="p-2">Rupiah</th>
                        <th className="p-2">Penyebab</th>
                        <th className="p-2 border-r border-slate-200">Sub Unsur</th>
                        <th className="p-2">Opini</th>
                        <th className="p-2">Klasifikasi</th>
                        <th className="p-2">Uraian Temuan</th>
                        <th className="p-2">Rupiah</th>
                        <th className="p-2">Penyebab</th>
                        <th className="p-2">Sub Unsur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-[11px]">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2 text-center">
                            <input
                              disabled={!isAuthorized}
                              type="text"
                              value={row.no}
                              onChange={(e) => handleCellChange(idx, 'no', e.target.value)}
                              className="w-full text-center bg-transparent border-0 focus:ring-1"
                            />
                          </td>
                          {/* 2025 columns */}
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.opini2025} onChange={(e) => handleCellChange(idx, 'opini2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.klasifikasi2025} onChange={(e) => handleCellChange(idx, 'klasifikasi2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.uraian2025} onChange={(e) => handleCellChange(idx, 'uraian2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.nilai2025} onChange={(e) => handleCellChange(idx, 'nilai2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.penyebab2025} onChange={(e) => handleCellChange(idx, 'penyebab2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input disabled={!isAuthorized} type="text" value={row.subunsur2025} onChange={(e) => handleCellChange(idx, 'subunsur2025', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          {/* 2024 columns */}
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.opini2024} onChange={(e) => handleCellChange(idx, 'opini2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.klasifikasi2024} onChange={(e) => handleCellChange(idx, 'klasifikasi2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.uraian2024} onChange={(e) => handleCellChange(idx, 'uraian2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.nilai2024} onChange={(e) => handleCellChange(idx, 'nilai2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.penyebab2024} onChange={(e) => handleCellChange(idx, 'penyebab2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          <td className="p-2">
                            <input disabled={!isAuthorized} type="text" value={row.subunsur2024} onChange={(e) => handleCellChange(idx, 'subunsur2024', e.target.value)} className="w-full bg-transparent border-0 focus:ring-1" />
                          </td>
                          {isAuthorized && (
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => deleteRow(idx)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

              </table>
            )}
          </div>

          {/* Table Save Section */}
          {isAuthorized && rows.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all flex items-center space-x-1.5"
              >
                <Save size={16} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Kertas Kerja'}</span>
              </button>
            </div>
          )}

        </div>

      </form>
    </div>
  );
}
