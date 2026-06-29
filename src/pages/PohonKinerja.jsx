import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Plus, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle, 
  XCircle, 
  FileEdit,
  ClipboardCheck,
  Building,
  Info
} from 'lucide-react';

// References for dropdowns
const REF_AOI_SASARAN = [
  "Sasaran tidak berorientasi hasil",
  "Sasaran tidak menggambarkan isu strategis",
  "Sasaran tidak sesuai mandat, tugas, dan fungsi",
  "Sasaran program belum ditetapkan",
  "Sasaran kegiatan belum ditetapkan",
  "Belum terlihat cross cutting sasaran",
  "Tidak selaras dengan sasaran diatasnya",
  "Overlapping antar sasaran/program/kegiatan"
];

const REF_AOI_INDIKATOR = [
  "Indikator tidak spesifik dan relevan",
  "Indikator tidak realistis",
  "Indikator overlapping antar sasaran/program/kegiatan",
  "Indikator tidak berorientasi pada hasil",
  "Indikator tidak time bound",
  "Indikator tidak dapat dievaluasi secara berkala",
  "Indikator tidak cukup untuk menggambarkan sasaran",
  "Indikator tidak dapat diukur secara obyektif"
];

const REF_AOI_TARGET = [
  "Target tidak SMART-C",
  "Target tidak memperhatikan capaian tahun lalu",
  "Target tidak proyektif"
];

const REF_CAUSE_CLUSTERS = ["Man", "Method", "Money", "Material", "Machine"];

export default function PohonKinerja({ profile }) {
  const [nodes, setNodes] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Form states for creating a new Node
  const [isAdding, setIsAdding] = useState(false);
  const [parentId, setParentId] = useState('');
  const [levelType, setLevelType] = useState('OPD');
  const [titleObjective, setTitleObjective] = useState('');
  const [indicatorName, setIndicatorName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('');
  const [selectedOpdId, setSelectedOpdId] = useState(profile?.opd_id || '');
  const [opdList, setOpdList] = useState([]);

  // Form states for KKE Assessment
  const [selectedNodeForKke, setSelectedNodeForKke] = useState(null);
  const [kkeData, setKkeData] = useState({});
  const [savingKke, setSavingKke] = useState(false);

  const userRole = profile?.role || 'OPD';
  const userOpdId = profile?.opd_id;

  useEffect(() => {
    fetchTree();
    fetchOPDs();
  }, []);

  const fetchOPDs = async () => {
    const { data } = await supabase.from('ref_opd').select('*').order('id');
    setOpdList(data || []);
  };

  const fetchTree = async () => {
    try {
      setLoading(true);
      // Fetch all nodes for the active year
      const { data, error } = await supabase
        .from('mst_pohon_kinerja')
        .select('*, ref_opd(name_opd)')
        .order('level_type', { ascending: true }) // We will structure it hierarchy-wise on client
        .order('id', { ascending: true });

      if (error) throw error;
      setNodes(data || []);
    } catch (err) {
      console.error('Error fetching pohon kinerja:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (id) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Build the hierarchical tree data structure from flat nodes
  const buildTree = () => {
    const nodeMap = {};
    nodes.forEach(node => {
      nodeMap[node.id] = { ...node, children: [] };
    });
    
    const tree = [];
    nodes.forEach(node => {
      const mappedNode = nodeMap[node.id];
      if (node.parent_id && nodeMap[node.parent_id]) {
        nodeMap[node.parent_id].children.push(mappedNode);
      } else {
        // If no parent, it's Level 0 (PEMDA)
        tree.push(mappedNode);
      }
    });
    return tree;
  };

  const handleAddNode = async (e) => {
    e.preventDefault();
    if (!titleObjective || !indicatorName || !targetValue || !unitOfMeasurement) {
      alert('Mohon lengkapi semua isian!');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        fiscal_year: 2026,
        level_type: levelType,
        parent_id: parentId ? parseInt(parentId) : null,
        title_objective: titleObjective,
        indicator_name: indicatorName,
        target_value: targetValue,
        unit_of_measurement: unitOfMeasurement,
        opd_id: levelType === 'PEMDA' ? null : parseInt(selectedOpdId)
      };

      const { data, error } = await supabase
        .from('mst_pohon_kinerja')
        .insert([payload])
        .select();

      if (error) throw error;

      // Reset Form
      setTitleObjective('');
      setIndicatorName('');
      setTargetValue('');
      setUnitOfMeasurement('');
      setIsAdding(false);
      
      // Auto expand parent
      if (parentId) {
        setExpandedNodes(prev => ({ ...prev, [parentId]: true }));
      }
      
      fetchTree();
    } catch (err) {
      console.error('Error adding node:', err);
      alert(err.message || 'Gagal menyimpan pohon kinerja.');
    } finally {
      setLoading(false);
    }
  };

  // Open Quality Appraisal (KKE Checklist) form for a specific node
  const handleOpenKke = async (node) => {
    setSelectedNodeForKke(node);
    setKkeData({});
    
    try {
      // Fetch existing assessment if any
      const { data, error } = await supabase
        .from('trx_kke_assessment')
        .select('*')
        .eq('pohon_kinerja_id', node.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for no row found
      
      if (data) {
        setKkeData(data.assessment_data || {});
      } else {
        // Default structure based on node level
        const defaults = {};
        const params = getParamsForLevel(node.level_type);
        params.forEach(p => {
          defaults[p.key] = {
            result: 'Y',
            aoi_cluster: '',
            aoi_desc: '',
            cause_cluster: '',
            cause_desc: ''
          };
        });
        setKkeData(defaults);
      }
    } catch (err) {
      console.error('Error fetching KKE assessment:', err);
    }
  };

  const handleSaveKke = async () => {
    if (!selectedNodeForKke) return;
    
    try {
      setSavingKke(true);
      
      // Check if row already exists
      const { data: existing } = await supabase
        .from('trx_kke_assessment')
        .select('id')
        .eq('pohon_kinerja_id', selectedNodeForKke.id)
        .single();

      const payload = {
        pohon_kinerja_id: selectedNodeForKke.id,
        opd_id: selectedNodeForKke.opd_id || 1, // default to bappeda if null (PEMDA level)
        fiscal_year: 2026,
        assessment_type: `KKE_${selectedNodeForKke.level_type === 'PEMDA' ? '1.1' : selectedNodeForKke.level_type === 'OPD' ? '1.2' : selectedNodeForKke.level_type === 'PROGRAM' ? '2.1' : selectedNodeForKke.level_type === 'KEGIATAN' ? '2.2' : '2.3'}`,
        assessment_data: kkeData
      };

      let error;
      if (existing) {
        const { error: err } = await supabase
          .from('trx_kke_assessment')
          .update({ assessment_data: kkeData })
          .eq('id', existing.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('trx_kke_assessment')
          .insert([payload]);
        error = err;
      }

      if (error) throw error;
      alert('Kertas Kerja Evaluasi (KKE) Kualitas berhasil disimpan!');
      setSelectedNodeForKke(null);
    } catch (err) {
      console.error('Error saving KKE:', err);
      alert(err.message || 'Gagal menyimpan evaluasi kualitas.');
    } finally {
      setSavingKke(false);
    }
  };

  const getParamsForLevel = (type) => {
    switch (type) {
      case 'PEMDA':
        return [
          { key: 'sasaran_tepat', label: 'Sasaran Strategis Pemda Tepat', aoiList: REF_AOI_SASARAN },
          { key: 'indikator_tepat', label: 'Indikator Kinerja Tepat dan Baik', aoiList: REF_AOI_INDIKATOR },
          { key: 'target_tepat', label: 'Target Kinerja Baik', aoiList: REF_AOI_TARGET }
        ];
      case 'OPD':
        return [
          { key: 'keterkaitan', label: 'Keterkaitan dengan Sasaran Strategis Pemda', aoiList: REF_AOI_SASARAN },
          { key: 'sasaran_tepat', label: 'Sasaran Strategis OPD Tepat', aoiList: REF_AOI_SASARAN },
          { key: 'indikator_tepat', label: 'Indikator Kinerja Tepat dan Baik', aoiList: REF_AOI_INDIKATOR },
          { key: 'target_tepat', label: 'Target Kinerja Baik', aoiList: REF_AOI_TARGET }
        ];
      case 'PROGRAM':
        return [
          { key: 'keterkaitan', label: 'Keterkaitan dengan Sasaran Strategis OPD', aoiList: REF_AOI_SASARAN },
          { key: 'sasaran_tepat', label: 'Sasaran Program Tepat', aoiList: REF_AOI_SASARAN },
          { key: 'indikator_tepat', label: 'Indikator Kinerja Tepat dan Baik', aoiList: REF_AOI_INDIKATOR },
          { key: 'target_tepat', label: 'Target Kinerja Baik', aoiList: REF_AOI_TARGET }
        ];
      case 'KEGIATAN':
        return [
          { key: 'keterkaitan', label: 'Keterkaitan dengan Sasaran Program', aoiList: REF_AOI_SASARAN },
          { key: 'sasaran_tepat', label: 'Sasaran Kegiatan Tepat', aoiList: REF_AOI_SASARAN },
          { key: 'indikator_tepat', label: 'Indikator Kinerja Tepat dan Baik', aoiList: REF_AOI_INDIKATOR },
          { key: 'target_tepat', label: 'Target Kinerja Baik', aoiList: REF_AOI_TARGET }
        ];
      case 'SUB_KEGIATAN':
        return [
          { key: 'keterkaitan', label: 'Keterkaitan dengan Sasaran Kegiatan', aoiList: REF_AOI_SASARAN },
          { key: 'indikator_tepat', label: 'Indikator Kinerja Tepat dan Baik', aoiList: REF_AOI_INDIKATOR },
          { key: 'target_tepat', label: 'Target Kinerja Baik', aoiList: REF_AOI_TARGET }
        ];
      default:
        return [];
    }
  };

  const handleKkeValueChange = (paramKey, field, value) => {
    setKkeData(prev => ({
      ...prev,
      [paramKey]: {
        ...prev[paramKey],
        [field]: value
      }
    }));
  };

  // Recursive component to render the tree nodes beautifully
  const TreeNode = ({ node, level = 0 }) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    
    // Authorization check for editing/adding:
    // Only Bappeda/Admin can write PEMDA level.
    // OPDs can only edit nodes belonging to their own OPD.
    const isAuthorizedToEdit = 
      userRole === 'ADMIN' || 
      (node.level_type === 'PEMDA' && userRole === 'BAPPEDA') ||
      (node.level_type !== 'PEMDA' && node.opd_id === userOpdId);

    const levelColors = {
      PEMDA: 'border-l-4 border-sky-500 bg-sky-50/70 hover:bg-sky-50',
      OPD: 'border-l-4 border-teal-500 bg-teal-50/40 hover:bg-teal-50/70',
      PROGRAM: 'border-l-4 border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/40',
      KEGIATAN: 'border-l-4 border-purple-400 bg-purple-50/10 hover:bg-purple-50/30',
      SUB_KEGIATAN: 'border-l-4 border-slate-300 bg-slate-50/50 hover:bg-slate-100/50'
    };

    return (
      <div className="mb-2">
        <div 
          className={`flex items-center justify-between p-4 rounded-xl border border-slate-100 shadow-sm transition-all duration-200 ${levelColors[node.level_type] || 'bg-white'}`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {hasChildren ? (
              <button 
                onClick={() => toggleNode(node.id)}
                className="p-1 rounded hover:bg-slate-200/50 text-slate-500 transition-colors"
              >
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            ) : (
              <div className="w-7 h-7 flex items-center justify-center text-slate-400">
                <Folder size={16} />
              </div>
            )}
            
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider bg-slate-200/80 text-slate-600">
                  {node.level_type}
                </span>
                {node.ref_opd && (
                  <span className="text-[10px] text-slate-500 flex items-center">
                    <Building size={10} className="mr-1" />
                    {node.ref_opd.name_opd}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm text-slate-800 mt-1 line-clamp-1">
                {node.title_objective}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                Indikator: <span className="font-medium text-slate-700">{node.indicator_name}</span> | Target: <span className="font-medium text-slate-700">{node.target_value} {node.unit_of_measurement}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => handleOpenKke(node)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-600 font-semibold text-xs transition-all duration-200 flex items-center space-x-1"
            >
              <ClipboardCheck size={14} />
              <span>Evaluasi KKE</span>
            </button>
            
            {isAuthorizedToEdit && node.level_type !== 'SUB_KEGIATAN' && (
              <button
                onClick={() => {
                  setParentId(node.id);
                  // Auto-resolve child level type
                  const childTypeMap = {
                    PEMDA: 'OPD',
                    OPD: 'PROGRAM',
                    PROGRAM: 'KEGIATAN',
                    KEGIATAN: 'SUB_KEGIATAN'
                  };
                  setLevelType(childTypeMap[node.level_type] || 'OPD');
                  setIsAdding(true);
                }}
                className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-600/10 hover:shadow-md hover:shadow-sky-500/15 transition-all duration-200"
                title="Tambahkan Program/Kegiatan di bawah ini"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 transition-all duration-300">
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const treeData = buildTree();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Panel */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Pohon Kinerja & Kertas Kerja Evaluasi (KKE)</h1>
          <p className="text-sm text-slate-500 mt-1">Struktur perencanaan berjenjang yang di-cascade dari tingkat Pemda hingga Sub-kegiatan OPD.</p>
        </div>

        {(userRole === 'ADMIN' || userRole === 'BAPPEDA') && (
          <button
            onClick={() => {
              setParentId('');
              setLevelType('PEMDA');
              setIsAdding(true);
            }}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Tambah Sasaran Pemda (Lvl 0)</span>
          </button>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && nodes.length === 0 ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-500 border-t-transparent"></div>
            <p className="text-xs text-slate-500">Mengambil bagan pohon kinerja...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {treeData.length === 0 ? (
            <div className="p-8 bg-sky-50/50 border border-sky-100 rounded-2xl text-center">
              <Info size={32} className="mx-auto text-sky-500 mb-2" />
              <h3 className="font-semibold text-slate-800 text-sm">Belum Ada Struktur Perencanaan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Silakan masuk sebagai Bappeda atau Admin untuk membuat Sasaran Strategis Pemda tingkat 0.
              </p>
            </div>
          ) : (
            treeData.map(rootNode => (
              <TreeNode key={rootNode.id} node={rootNode} />
            ))
          )}
        </div>
      )}

      {/* MODAL: ADD PLANNING NODE */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Tambah Kinerja Baru ({levelType})
                </h3>
                {parentId && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Sub-level di bawah Node ID #{parentId}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setIsAdding(false)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleAddNode} className="p-6 space-y-4">
              {levelType !== 'PEMDA' && userRole === 'ADMIN' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Instansi OPD Pengampu</label>
                  <select
                    value={selectedOpdId}
                    onChange={(e) => setSelectedOpdId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Pilih OPD...</option>
                    {opdList.map(opd => (
                      <option key={opd.id} value={opd.id}>{opd.name_opd}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Uraian Sasaran / Kegiatan / Program</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Misal: Terwujudnya tata kelola keuangan daerah yang akuntabel..."
                  value={titleObjective}
                  onChange={(e) => setTitleObjective(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nama Indikator Kinerja</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Opini Laporan Keuangan"
                  value={indicatorName}
                  onChange={(e) => setIndicatorName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Target Kinerja</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: 100 atau WTP"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Satuan Ukur</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Persen, Laporan, Opini"
                    value={unitOfMeasurement}
                    onChange={(e) => setUnitOfMeasurement(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perencanaan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KKE QUALITY ASSESSMENT CHECKLIST */}
      {selectedNodeForKke && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider bg-sky-500/10 text-sky-600">
                  Kertas Kerja Evaluasi KKE
                </span>
                <h3 className="font-bold text-slate-800 text-sm mt-1">
                  Evaluasi Kualitas: {selectedNodeForKke.title_objective}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedNodeForKke(null)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Batal
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {getParamsForLevel(selectedNodeForKke.level_type).map(param => {
                const val = kkeData[param.key] || {
                  result: 'Y',
                  aoi_cluster: '',
                  aoi_desc: '',
                  cause_cluster: '',
                  cause_desc: ''
                };
                
                return (
                  <div key={param.key} className="p-5 border border-slate-100 bg-slate-50/30 rounded-xl space-y-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-xs text-slate-700 max-w-[70%]">
                        {param.label}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleKkeValueChange(param.key, 'result', 'Y')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center space-x-1 ${
                            val.result === 'Y' 
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm' 
                              : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <CheckCircle size={12} />
                          <span>Ya (Y)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleKkeValueChange(param.key, 'result', 'T')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center space-x-1 ${
                            val.result === 'T' 
                              ? 'bg-rose-50 border border-rose-200 text-rose-600 shadow-sm' 
                              : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <XCircle size={12} />
                          <span>Tidak (T)</span>
                        </button>
                      </div>
                    </div>

                    {/* Show Area of Improvement & Cause fields ONLY if Answer is 'T' (Tidak) */}
                    {val.result === 'T' && (
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100/50 animate-in slide-in-from-top-3 duration-250">
                        {/* AoI Group */}
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Klaster Area of Improvement (AoI)</label>
                          <select
                            value={val.aoi_cluster || ''}
                            onChange={(e) => handleKkeValueChange(param.key, 'aoi_cluster', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="">Pilih Klaster AoI...</option>
                            {param.aoiList.map((aoi, index) => (
                              <option key={index} value={aoi}>{aoi}</option>
                            ))}
                          </select>
                          <textarea
                            rows="2"
                            placeholder="Tuliskan uraian kelemahan indikator..."
                            value={val.aoi_desc || ''}
                            onChange={(e) => handleKkeValueChange(param.key, 'aoi_desc', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                          />
                        </div>

                        {/* Cause Group */}
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Klaster Penyebab (5M)</label>
                          <select
                            value={val.cause_cluster || ''}
                            onChange={(e) => handleKkeValueChange(param.key, 'cause_cluster', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="">Pilih Penyebab...</option>
                            {REF_CAUSE_CLUSTERS.map((cls, index) => (
                              <option key={index} value={cls}>{cls}</option>
                            ))}
                          </select>
                          <textarea
                            rows="2"
                            placeholder="Uraikan detail penyebab di lapangan..."
                            value={val.cause_desc || ''}
                            onChange={(e) => handleKkeValueChange(param.key, 'cause_desc', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedNodeForKke(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors duration-200"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={savingKke}
                onClick={handleSaveKke}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-500/15 transition-all duration-200 disabled:opacity-50 flex items-center space-x-1"
              >
                {savingKke ? 'Menyimpan...' : 'Simpan Hasil KKE'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
