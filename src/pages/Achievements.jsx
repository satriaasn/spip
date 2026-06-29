import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Save, FileCheck, BarChart3, AlertTriangle, ShieldCheck } from 'lucide-react';

const SHEETS = [
  { id: 'kk5', name: 'KK 5 (Capaian Sasaran)', roles: ['BAPPEDA', 'ADMIN'] },
  { id: 'kk6', name: 'KK 6 (Pelaporan Keuangan)', roles: ['BPKAD', 'ADMIN'] },
  { id: 'kk7', name: 'KK 7 (Pengamanan Aset)', roles: ['BPKAD', 'ADMIN'] },
  { id: 'kk8', name: 'KK 8 (Ketaatan & Korupsi)', roles: ['INSPEKTORAT', 'ADMIN'] }
];

export default function Achievements({ profile }) {
  const [activeTab, setActiveTab] = useState('kk5');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State - KK 5 (Outcomes & Outputs averages)
  const [kk5PemdaOutcome, setKk5PemdaOutcome] = useState('A'); // Grade A-E
  const [kk5OpdOutcome, setKk5OpdOutcome] = useState('B'); // Grade A-E
  const [kk5Output, setKk5Output] = useState('C'); // Grade A-E

  // Form State - KK 6 (Pelaporan Keuangan)
  const [kk6Opini2025, setKk6Opini2025] = useState('WTP');
  const [kk6Opini2024, setKk6Opini2024] = useState('WTP');
  const [kk6TemuanCount, setKk6TemuanCount] = useState(0);
  const [kk6TemuanRupiah, setKk6TemuanRupiah] = useState('0');

  // Form State - KK 7 (Pengamanan Aset)
  const [kk7KondisiBaik, setKk7KondisiBaik] = useState('90');
  const [kk7TemuanAset, setKk7TemuanAset] = useState('3'); // Grade A-E equivalent
  const [kk7UraianAset, setKk7UraianAset] = useState('');

  // Form State - KK 8 (Ketaatan & Korupsi)
  const [kk8TemuanCount, setKk8TemuanCount] = useState(1);
  const [kk8Korupsi, setKk8Korupsi] = useState('Tidak'); // 'Ya' / 'Tidak'

  const userRole = profile?.role || 'OPD';

  useEffect(() => {
    // Auto focus tab matching user role
    if (userRole === 'BAPPEDA') setActiveTab('kk5');
    if (userRole === 'BPKAD') setActiveTab('kk6');
    if (userRole === 'INSPEKTORAT') setActiveTab('kk8');
    
    fetchAchievementData();
  }, [activeTab]);

  const fetchAchievementData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trx_achievement_assessment')
        .select('*')
        .eq('fiscal_year', 2026)
        .eq('kk_type', activeTab === 'kk5' ? 'KK5' : activeTab === 'kk6' ? 'KK6' : activeTab === 'kk7' ? 'KK7' : 'KK8')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.data_payload) {
        const payload = data.data_payload;
        if (activeTab === 'kk5') {
          setKk5PemdaOutcome(payload.pemda_outcome || 'A');
          setKk5OpdOutcome(payload.opd_outcome || 'B');
          setKk5Output(payload.output || 'C');
        } else if (activeTab === 'kk6') {
          setKk6Opini2025(payload.opini_2025 || 'WTP');
          setKk6Opini2024(payload.opini_2024 || 'WTP');
          setKk6TemuanCount(payload.temuan_count || 0);
          setKk6TemuanRupiah(payload.temuan_rupiah || '0');
        } else if (activeTab === 'kk7') {
          setKk7KondisiBaik(payload.kondisi_baik || '90');
          setKk7TemuanAset(payload.temuan_aset || '3');
          setKk7UraianAset(payload.uraian_aset || '');
        } else if (activeTab === 'kk8') {
          setKk8TemuanCount(payload.temuan_count || 1);
          setKk8Korupsi(payload.korupsi || 'Tidak');
        }
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const type = activeTab === 'kk5' ? 'KK5' : activeTab === 'kk6' ? 'KK6' : activeTab === 'kk7' ? 'KK7' : 'KK8';
      let payload = {};

      if (activeTab === 'kk5') {
        payload = { pemda_outcome: kk5PemdaOutcome, opd_outcome: kk5OpdOutcome, output: kk5Output };
      } else if (activeTab === 'kk6') {
        payload = { opini_2025: kk6Opini2025, opini_2024: kk6Opini2024, temuan_count: parseInt(kk6TemuanCount), temuan_rupiah: kk6TemuanRupiah };
      } else if (activeTab === 'kk7') {
        payload = { kondisi_baik: kk7KondisiBaik, temuan_aset: kk7TemuanAset, uraian_aset: kk7UraianAset };
      } else if (activeTab === 'kk8') {
        payload = { temuan_count: parseInt(kk8TemuanCount), korupsi: kk8Korupsi };
      }

      // Check existing row
      const { data: existing } = await supabase
        .from('trx_achievement_assessment')
        .select('id')
        .eq('fiscal_year', 2026)
        .eq('kk_type', type)
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
          .insert([{ fiscal_year: 2026, kk_type: type, data_payload: payload }]);
        error = err;
      }

      if (error) throw error;
      alert(`Data ${activeTab.toUpperCase()} berhasil disimpan!`);
      fetchAchievementData();
    } catch (err) {
      console.error('Error saving achievement data:', err);
      alert(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const filteredTabs = SHEETS.filter(s => s.roles.includes(userRole));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">Capaian & Hasil Audit (KK5 - KK8)</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola data capaian sasaran daerah (outcome/output), opini laporan keuangan BPK, serta catatan aset dan ketaatan hukum.</p>
      </div>

      {/* Tab select */}
      <div className="flex border border-slate-200/60 mb-6 bg-white p-1 rounded-xl shadow-sm space-x-1">
        {filteredTabs.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === s.id 
                ? 'bg-sky-600 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-500 border-t-transparent"></div>
              <p className="text-xs text-slate-500">Memuat data formulir...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* KK 5 Panel */}
            {activeTab === 'kk5' && (
              <div className="space-y-4">
                <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-start space-x-2 text-sky-700 text-xs leading-relaxed mb-4">
                  <BarChart3 size={16} className="mt-0.5" />
                  <span>
                    Form ini merekam hasil simpulan akhir dari capaian Sasaran Strategis Pemda (`KK 5.1 A`), Sasaran Strategis OPD (`KK 5.1 B`), dan Capaian Output (`KK 5.2`).
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Grade Capaian Sasaran Pemda (KK 5.1 A)</label>
                  <select
                    value={kk5PemdaOutcome}
                    onChange={(e) => setKk5PemdaOutcome(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="A">Grade A (Capaian ≥ 90%)</option>
                    <option value="B">Grade B (Capaian 70% s.d 89%)</option>
                    <option value="C">Grade C (Capaian 50% s.d 69%)</option>
                    <option value="D">Grade D (Capaian 30% s.d 49%)</option>
                    <option value="E">Grade E (Capaian &lt; 30%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Grade Capaian Sasaran OPD (KK 5.1 B)</label>
                  <select
                    value={kk5OpdOutcome}
                    onChange={(e) => setKk5OpdOutcome(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="A">Grade A (Capaian ≥ 90%)</option>
                    <option value="B">Grade B (Capaian 70% s.d 89%)</option>
                    <option value="C">Grade C (Capaian 50% s.d 69%)</option>
                    <option value="D">Grade D (Capaian 30% s.d 49%)</option>
                    <option value="E">Grade E (Capaian &lt; 30%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Grade Capaian Output Kegiatan (KK 5.2)</label>
                  <select
                    value={kk5Output}
                    onChange={(e) => setKk5Output(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="A">Grade A (Capaian ≥ 90%)</option>
                    <option value="B">Grade B (Capaian 70% s.d 89%)</option>
                    <option value="C">Grade C (Capaian 50% s.d 69%)</option>
                    <option value="D">Grade D (Capaian 30% s.d 49%)</option>
                    <option value="E">Grade E (Capaian &lt; 30%)</option>
                  </select>
                </div>
              </div>
            )}

            {/* KK 6 Panel */}
            {activeTab === 'kk6' && (
              <div className="space-y-4">
                <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-start space-x-2 text-sky-700 text-xs leading-relaxed mb-4">
                  <FileCheck size={16} className="mt-0.5" />
                  <span>
                    Form ini merekam hasil pemeriksaan Laporan Keuangan Pemerintah Daerah oleh BPK RI. Opini ini menentukan nilai Keandalan Pelaporan Keuangan.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Opini BPK RI Tahun 2025</label>
                    <select
                      value={kk6Opini2025}
                      onChange={(e) => setKk6Opini2025(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="WTP">WTP (Wajar Tanpa Pengecualian)</option>
                      <option value="WDP">WDP (Wajar Dengan Pengecualian)</option>
                      <option value="TW">TW (Tidak Wajar)</option>
                      <option value="TMP">TMP (Tidak Memberikan Pendapat)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Opini BPK RI Tahun 2024</label>
                    <select
                      value={kk6Opini2024}
                      onChange={(e) => setKk6Opini2024(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="WTP">WTP (Wajar Tanpa Pengecualian)</option>
                      <option value="WDP">WDP (Wajar Dengan Pengecualian)</option>
                      <option value="TW">TW (Tidak Wajar)</option>
                      <option value="TMP">TMP (Tidak Memberikan Pendapat)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Jumlah Temuan Kelemahan SPI</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={kk6TemuanCount}
                      onChange={(e) => setKk6TemuanCount(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nilai Temuan Kerugian Daerah (Rp)</label>
                    <input
                      type="text"
                      required
                      placeholder="0"
                      value={kk6TemuanRupiah}
                      onChange={(e) => setKk6TemuanRupiah(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* KK 7 Panel */}
            {activeTab === 'kk7' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Persentase Aset Tetap Dalam Kondisi Baik (%)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={kk7KondisiBaik}
                    onChange={(e) => setKk7KondisiBaik(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Simpulan Grade Permasalahan Aset (LHP BPK)</label>
                  <select
                    value={kk7TemuanAset}
                    onChange={(e) => setKk7TemuanAset(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="A">Grade A (Selama 5 tahun bebas masalah hukum aset)</option>
                    <option value="B">Grade B (Selama 3 tahun bebas masalah hukum aset)</option>
                    <option value="C">Grade C (Selama 2 tahun bebas masalah hukum aset)</option>
                    <option value="D">Grade D (Ada masalah hukum aset dalam 2 tahun terakhir)</option>
                    <option value="E">Grade E (Banyak masalah hukum / tidak ada pengamanan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Uraian Catatan Permasalahan Aset</label>
                  <textarea
                    rows="3"
                    placeholder="Catat temuan administrasi, pengamanan fisik, sertifikasi tanah jalan, atau kehilangan BMD..."
                    value={kk7UraianAset}
                    onChange={(e) => setKk7UraianAset(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20 resize-none"
                  />
                </div>
              </div>
            )}

            {/* KK 8 Panel */}
            {activeTab === 'kk8' && (
              <div className="space-y-4">
                <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-start space-x-2 text-sky-700 text-xs leading-relaxed mb-4">
                  <ShieldCheck size={16} className="mt-0.5" />
                  <span>
                    Form ini merekam hasil audit ketaatan peraturan dan adanya tindak pidana korupsi yang melibatkan pejabat daerah.
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Jumlah Temuan Ketidakpatuhan Peraturan (LHP BPK)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={kk8TemuanCount}
                    onChange={(e) => setKk8TemuanCount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Keterjadian Tindak Pidana Korupsi oleh Pejabat Eselon I/II/Politis</label>
                  <select
                    value={kk8Korupsi}
                    onChange={(e) => setKk8Korupsi(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="Tidak">Tidak Ada Kejadian Korupsi</option>
                    <option value="Ya">Ada Kejadian Korupsi</option>
                  </select>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center space-x-1.5"
              >
                <Save size={16} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Data'}</span>
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
}
