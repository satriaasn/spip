import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Compass, 
  ShieldCheck, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight, 
  Activity, 
  Award, 
  Layers, 
  Building2, 
  Sliders, 
  ChevronRight, 
  RefreshCw 
} from 'lucide-react';

// Subelement labels from workbook
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
  '1.1': [
    { no: 1, desc: 'Organisasi menegakkan integritas dan nilai etika dalam melaksanakan tugas dan fungsi organisasi, pengelolaan keuangan, pengelolaan aset, serta pelaksanaan tugas sesuai peraturan yang berlaku.', type: 'SPIP' },
    { no: 2, desc: 'Kebijakan eksplisit atas pengendalian korupsi yang mencakup pernyataan kebijakan, penetapan struktur pengelola risiko korupsi, serta standar perilaku antikorupsi.', type: 'SPIP' },
    { no: 3, desc: 'Organisasi menetapkan dan melaksanakan SOP antikorupsi yang mencakup tiga proses prinsip dalam pengelolaan risiko korupsi (cegah, deteksi, respons).', type: 'SPIP' },
    { no: 4, desc: 'Unit kerja sebagai lingkungan belajar dikelola untuk memungkinkan pegawai di semua level berpartisipasi dalam program antikorupsi.', type: 'SPIP' },
    { no: 5, desc: 'Integritas organisasional yang terwujud dalam transparansi dan akuntabilitas telah tercermin dalam visi, misi, tujuan, dan nilai-nilai organisasi.', type: 'SPIP' },
    { no: 6, desc: 'Terdapat persepsi bersama bahwa yang dijadikan acuan utama sebagai perilaku etis adalah peraturan, SOP, hukum, atau standar profesional.', type: 'SPIP' },
    { no: 7, desc: 'Kejadian korupsi/perilaku koruptif telah ditindaklanjuti oleh orang yang kompeten dan independen.', type: 'SPIP' },
    { no: 9, desc: 'Atas hasil audit atau investigasi telah diambil langkah dalam rangka memperbaiki kerusakan yang ditimbulkan oleh praktik korupsi.', type: 'SPIP' }
  ],
  '1.2': [
    { no: 1, desc: 'Tugas dan jabatan dalam organisasi dilaksanakan dan diisi oleh SDM yang kompeten.', type: 'SPIP' }
  ],
  '1.3': [
    { no: 1, desc: 'Pimpinan organisasi menciptakan lingkungan kerja yang kondusif untuk pencapaian tujuan organisasi.', type: 'SPIP' },
    { no: 2, desc: 'Pimpinan Instansi Pemerintah mengalokasikan sumber daya untuk penerapan manajemen risiko.', type: 'SPIP' },
    { no: 3, desc: 'Pimpinan Instansi Pemerintah menggunakan informasi terkait risiko dalam pengambilan keputusan.', type: 'SPIP' },
    { no: 4, desc: 'Pimpinan Instansi Pemerintah mendorong penerapan manajemen risiko melalui indikator penilaian kinerja.', type: 'SPIP' },
    { no: 5, desc: 'Program antikorupsi didukung dengan penyediaan alokasi sumberdaya secara eksplisit secara memadai.', type: 'SPIP' },
    { no: 6, desc: 'Faktor kekuasaan dan wewenang yang melekat pada pimpinan unit kerja dipakai untuk tujuan mengelola risiko korupsi secara efektif.', type: 'SPIP' },
    { no: 7, desc: 'Pimpinan mendorong bawahan untuk mengikutinya melalui atensi, keterbukaan, reinforcement, perlakuan adil, dan pertimbangan etis.', type: 'SPIP' }
  ],
  '1.4': [
    { no: 1, desc: 'Struktur organisasi dibentuk dalam rangka mendukung pencapaian sasaran strategis, keandalan laporan keuangan, keamanan aset, serta kepatuhan internal.', type: 'SPIP' }
  ],
  '1.5': [
    { no: 1, desc: 'Wewenang dan tanggung jawab diberikan kepada pegawai yang tepat sesuai tingkatannya dengan memperhatikan benturan kepentingan.', type: 'SPIP' }
  ],
  '1.6': [
    { no: 1, desc: 'Penerapan kebijakan manajemen dan praktik pembinaan SDM sehingga dapat digunakan secara maksimal untuk mencapai tujuan organisasi.', type: 'SPIP' },
    { no: 2, desc: 'Pegawai telah mendapatkan fasilitas untuk meningkatkan kompetensi dan keterampilan terkait manajemen risiko.', type: 'SPIP' },
    { no: 3, desc: 'Pegawai memiliki kesadaran terkait manajemen risiko.', type: 'SPIP' }
  ],
  '1.7': [
    { no: 1, desc: 'Pengawasan APIP telah dapat memberikan nilai tambah pada perbaikan pengendalian organisasi.', type: 'SPIP' }
  ],
  '1.8': [
    { no: 1, desc: 'Pimpinan organisasi menjalin hubungan kerja yang baik (kemitraan) dengan instansi lain terkait pencapaian tujuan.', type: 'SPIP' },
    { no: 2, desc: 'Instansi Pemerintah telah mengidentifikasi, menilai, dan mengelola risiko terkait kemitraan.', type: 'SPIP' }
  ],
  '2.1': [
    { no: 1, desc: 'Pemerintah Daerah telah memiliki Kebijakan Manajemen Risiko.', type: 'SPIP' },
    { no: 2, desc: 'Risiko telah teridentifikasi dan dituangkan dalam register risiko.', type: 'SPIP' },
    { no: 3, desc: 'Proses manajemen risiko telah melekat pada proses bisnis Instansi Pemerintah.', type: 'SPIP' }
  ],
  '2.2': [
    { no: 1, desc: 'Seluruh risiko telah dianalisis dampak dan tingkat keterjadiannya.', type: 'SPIP' },
    { no: 2, desc: 'Instansi pemerintah telah menentukan prioritas risiko.', type: 'SPIP' },
    { no: 3, desc: 'Instansi Pemerintah telah menentukan rencana tindak pengendalian.', type: 'SPIP' },
    { no: 4, desc: 'Tindak pengendalian telah diimplementasikan.', type: 'SPIP' },
    { no: 5, desc: 'Tindak pengendalian efektif menurunkan risiko.', type: 'SPIP' },
    { no: 6, desc: 'Analisis dan asesmen risiko korupsi menghasilkan rancangan tindak pengendalian untuk memitigasi risiko korupsi.', type: 'SPIP' }
  ],
  '3.1': [
    { no: 1, desc: 'Pimpinan organisasi membandingkan tolok ukur kinerja dengan capaian kinerja secara berkala.', type: 'SPIP' }
  ],
  '3.2': [
    { no: 1, desc: 'Pembinaan SDM dilakukan sehingga setiap pegawai dapat memberikan manfaat optimal.', type: 'SPIP' }
  ],
  '3.3': [
    { no: 1, desc: 'Pengendalian atas pengelolaan sistem informasi dilakukan untuk menyajikan data yang akurat dan tepat waktu.', type: 'SPIP' }
  ],
  '3.4': [
    { no: 1, desc: 'Pengelolaan BMN/D dilakukan untuk menjamin aset tersedia dan dapat digunakan dengan baik.', type: 'SPIP' }
  ],
  '3.5': [
    { no: 1, desc: 'Kegiatan pengendalian atas penetapan dan reviu atas indikator dan ukuran kinerja dilakukan untuk menjamin keandalan.', type: 'SPIP' }
  ],
  '3.6': [
    { no: 1, desc: 'Terdapat pemisahan fungsi sehingga seluruh aspek utama transaksi dan kejadian tidak dikendalikan oleh satu orang.', type: 'SPIP' }
  ],
  '3.7': [
    { no: 1, desc: 'Terdapat proses otorisasi transaksi dan kejadian penting oleh pihak yang berwenang.', type: 'SPIP' }
  ],
  '3.8': [
    { no: 1, desc: 'Terdapat proses untuk memastikan transaksi diklasifikasikan dan dicatat dengan segera.', type: 'SPIP' }
  ],
  '3.9': [
    { no: 1, desc: 'Terdapat pembatasan atas kesempatan dan hak untuk mengakses sumber daya dan pencatatannya.', type: 'SPIP' }
  ],
  '3.10': [
    { no: 1, desc: 'Terdapat pertanggungjawaban seseorang atau unit organisasi dalam mengelola sumber daya.', type: 'SPIP' }
  ],
  '3.11': [
    { no: 1, desc: 'Terdapat pendokumentasian secara berkala atas SPI serta transaksi dan kejadian penting.', type: 'SPIP' }
  ],
  '4.1': [
    { no: 1, desc: 'Tersedianya informasi yang relevan untuk kebutuhan internal dan eksternal.', type: 'SPIP' },
    { no: 2, desc: 'Pimpinan Instansi Pemerintah membangun sistem pengaduan.', type: 'SPIP' },
    { no: 3, desc: 'Strategi dan kebijakan manajemen risiko telah dikomunikasikan.', type: 'SPIP' },
    { no: 4, desc: 'Register risiko dan rencana tindak pengendalian telah dikomunikasikan.', type: 'SPIP' },
    { no: 5, desc: 'Saluran pelaporan internal dikelola secara kredibel dengan perlindungan pelapor.', type: 'SPIP' }
  ],
  '4.2': [
    { no: 1, desc: 'Terlaksananya komunikasi yang efektif dengan internal dan eksternal.', type: 'SPIP' }
  ],
  '5.1': [
    { no: 1, desc: 'Pimpinan organisasi mengevaluasi secara berkala pengendalian intern.', type: 'SPIP' },
    { no: 2, desc: 'Proses manajemen risiko telah direviu.', type: 'SPIP' },
    { no: 3, desc: 'Pemantauan/monitoring terhadap risiko telah dilakukan.', type: 'SPIP' }
  ],
  '5.2': [
    { no: 1, desc: 'Evaluasi terpisah dilakukan oleh pegawai ahli atau APIP/auditor eksternal.', type: 'SPIP' },
    { no: 2, desc: 'Terdapat reviu independen terhadap proses manajemen risiko.', type: 'SPIP' }
  ]
};

const PARAM_PILLARS = {
  '1.1': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T4'], 3: ['T4'], 4: ['T4'], 5: ['T4'], 6: ['T4'], 7: ['T4'], 9: ['T4'] },
  '1.2': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '1.3': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T1', 'T2', 'T3', 'T4'], 3: ['T1', 'T2', 'T3', 'T4'], 4: ['T1', 'T2', 'T3', 'T4'], 5: ['T4'], 6: ['T4'], 7: ['T4'] },
  '1.4': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '1.5': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '1.6': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T1', 'T2', 'T3', 'T4'], 3: ['T4'] },
  '1.7': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '1.8': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T1', 'T2', 'T3', 'T4'] },
  '2.1': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T1', 'T2', 'T3', 'T4'], 3: ['T1', 'T2', 'T3', 'T4'] },
  '2.2': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T1', 'T2', 'T3', 'T4'], 3: ['T1', 'T2', 'T3', 'T4'], 4: ['T1', 'T2', 'T3', 'T4'], 5: ['T1', 'T2', 'T3', 'T4'], 6: ['T4'] },
  '3.1': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.2': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.3': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.4': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.5': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.6': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.7': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.8': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.9': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.10': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '3.11': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '4.1': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T1', 'T2', 'T3', 'T4'], 3: ['T1', 'T2', 'T3', 'T4'], 4: ['T1', 'T2', 'T3', 'T4'], 5: ['T4'] },
  '4.2': { 1: ['T1', 'T2', 'T3', 'T4'] },
  '5.1': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T1', 'T2', 'T3', 'T4'], 3: ['T1', 'T2', 'T3', 'T4'] },
  '5.2': { 1: ['T1', 'T2', 'T3', 'T4'], 2: ['T1', 'T2', 'T3', 'T4'] }
};

const GRADE_TO_SCORE = { A: 5, B: 4, C: 3, D: 2, E: 1 };

export default function Dashboard({ profile, calculationMode, toggleCalculationMode, selectedYear }) {
  const [activeTab, setActiveTab] = useState('spip'); // 'spip', 'kklead1', 'kklead2', 'kklead3'
  
  // Database datasets
  const [opds, setOpds] = useState([]);
  const [treeNodes, setTreeNodes] = useState([]);
  const [kkeAssessments, setKkeAssessments] = useState([]);
  const [subAssessments, setSubAssessments] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scoping filters
  const [selectedOpdScope, setSelectedOpdScope] = useState('pemda'); // 'pemda' or numeric opdId
  const userRole = profile?.role || 'OPD';
  const userOpdId = profile?.opd_id;

  useEffect(() => {
    // Lock scope if user is OPD
    if (userRole === 'OPD' && userOpdId) {
      setSelectedOpdScope(String(userOpdId));
    }
    loadAllData();
  }, [userRole, userOpdId, selectedYear]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch OPDs
      const { data: opdList } = await supabase.from('ref_opd').select('*').order('id');
      setOpds(opdList || []);

      // Fetch Tree nodes and KKE (increase limit to fetch everything)
      const { data: tree } = await supabase.from('mst_pohon_kinerja').select('*').eq('fiscal_year', selectedYear).limit(2000);
      setTreeNodes(tree || []);

      const { data: kke } = await supabase.from('trx_kke_assessment').select('*').eq('fiscal_year', selectedYear).limit(2000);
      setKkeAssessments(kke || []);

      // Fetch Subelements (increase limit to fetch everything)
      const { data: subs } = await supabase.from('trx_subelement_assessment').select('*').eq('fiscal_year', selectedYear).limit(2500);
      setSubAssessments(subs || []);

      // Fetch Achievements
      const { data: achs } = await supabase.from('trx_achievement_assessment').select('*').eq('fiscal_year', selectedYear);
      setAchievements(achs || []);

    } catch (err) {
      console.error('Error fetching dashboard datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Dynamic Math Computations based on scope and calculation mode ---
  
  // Helper to get Mode grade across filtered assessments
  const calculateModeGrade = (list) => {
    if (!list || list.length === 0) return 'E';
    const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    list.forEach(val => {
      if (counts[val] !== undefined) counts[val]++;
    });
    let maxCount = -1;
    let mode = 'E';
    ['A', 'B', 'C', 'D', 'E'].forEach(g => {
      if (counts[g] > maxCount) {
        maxCount = counts[g];
        mode = g;
      }
    });
    return mode;
  };

  // Subelement Aggregate score calculations (Buggy emulation vs Correct)
  const getSubelementAggregateScore = (subCode, pillarType) => {
    // 1. Get parameters of this subelement
    const params = SUBELEMENT_PARAMETERS[subCode] || [];
    
    // 2. Filter parameters that apply to this pillar
    const applicableParams = params.filter(p => {
      const pillars = PARAM_PILLARS[subCode]?.[p.no] || [];
      return pillars.includes(pillarType);
    });

    if (applicableParams.length === 0) return null;

    // 3. Resolve scores for each applicable parameter
    const scores = applicableParams.map(p => {
      // Find assessments for this subCode, paramNo, and pillar
      let matches = subAssessments.filter(sa => 
        sa.subelement_code === subCode && 
        sa.parameter_no === p.no && 
        sa.pillar_type === pillarType
      );

      // Filter by OPD scope
      if (selectedOpdScope !== 'pemda') {
        matches = matches.filter(sa => sa.opd_id === parseInt(selectedOpdScope));
      }

      // If specific OPD and no record, default to E
      if (selectedOpdScope !== 'pemda') {
        const record = matches[0];
        const grade = record?.verified_grade || record?.opd_grade || 'E';
        return GRADE_TO_SCORE[grade];
      } else {
        // Consolidated Pemda: calculate Mode grade across all OPD records
        const gradesList = matches.map(m => m.verified_grade || m.opd_grade).filter(Boolean);
        const modeGrade = calculateModeGrade(gradesList);
        return GRADE_TO_SCORE[modeGrade];
      }
    });

    // 4. Run calculation based on Mode
    if (calculationMode === 'emulation') {
      if (scores.length === 1) return scores[0];
      const sumExceptLast = scores.slice(0, -1).reduce((sum, v) => sum + v, 0);
      const lastScore = scores[scores.length - 1];
      return sumExceptLast + (lastScore / scores.length);
    } else {
      // Correct average
      const sum = scores.reduce((s, v) => s + v, 0);
      return sum / scores.length;
    }
  };

  // Subelement Parameter score calculations (for KKLEAD II drilldown rows)
  const getParamScore = (subCode, paramNo, pillarType) => {
    const pillars = PARAM_PILLARS[subCode]?.[paramNo] || [];
    if (!pillars.includes(pillarType)) return null; // does not apply

    let matches = subAssessments.filter(sa => 
      sa.subelement_code === subCode && 
      sa.parameter_no === paramNo && 
      sa.pillar_type === pillarType
    );

    if (selectedOpdScope !== 'pemda') {
      matches = matches.filter(sa => sa.opd_id === parseInt(selectedOpdScope));
      const record = matches[0];
      const grade = record?.verified_grade || record?.opd_grade || 'E';
      return GRADE_TO_SCORE[grade];
    } else {
      const gradesList = matches.map(m => m.verified_grade || m.opd_grade).filter(Boolean);
      const modeGrade = calculateModeGrade(gradesList);
      return GRADE_TO_SCORE[modeGrade];
    }
  };

  // Calculate KKE Ratios
  const getKkeRatio = (assessmentType, key) => {
    let matches = kkeAssessments.filter(ka => ka.assessment_type === assessmentType);
    if (selectedOpdScope !== 'pemda') {
      matches = matches.filter(ka => ka.opd_id === parseInt(selectedOpdScope));
    }

    const yCount = matches.filter(m => m.assessment_data?.[key]?.result === 'Y').length;
    const totalCount = matches.filter(m => m.assessment_data?.[key]?.result).length;

    return totalCount > 0 ? yCount / totalCount : 1.0; // fallback if empty
  };

  // Compile calculations for KKLEAD I
  // Sasaran Strategis Pemda (KKE 1.1)
  const kke11_sasaran = getKkeRatio('KKE_1.1', 'sasaran_tepat');
  const kke11_indikator = getKkeRatio('KKE_1.1', 'indikator_tepat');
  const kke11_target = getKkeRatio('KKE_1.1', 'target_tepat');
  const scoreKKE11 = kke11_sasaran * 0.4 + kke11_indikator * 0.3 + kke11_target * 0.3;

  // Sasaran Strategis OPD (KKE 1.2)
  const kke12_keterkaitan = getKkeRatio('KKE_1.2', 'keterkaitan');
  const kke12_sasaran = getKkeRatio('KKE_1.2', 'sasaran_tepat');
  const kke12_indikator = getKkeRatio('KKE_1.2', 'indikator_tepat');
  const kke12_target = getKkeRatio('KKE_1.2', 'target_tepat');
  const scoreKKE12 = kke12_keterkaitan * 0.3 + kke12_sasaran * 0.3 + kke12_indikator * 0.2 + kke12_target * 0.2;

  // Aggregate KK1 Score (Kualitas Sasaran)
  const scoreKK1 = scoreKKE11 * 0.5 + scoreKKE12 * 0.5;
  const levelKK1 = scoreKK1 > 0.90 ? 5 : scoreKK1 > 0.80 ? 4 : scoreKK1 > 0.70 ? 3 : scoreKK1 > 0.60 ? 2 : 1;

  // Kualitas Sasaran Program (KKE 2.1)
  const kke21_keterkaitan = getKkeRatio('KKE_2.1', 'keterkaitan');
  const kke21_sasaran = getKkeRatio('KKE_2.1', 'sasaran_tepat');
  const kke21_indikator = getKkeRatio('KKE_2.1', 'indikator_tepat');
  const kke21_target = getKkeRatio('KKE_2.1', 'target_tepat');
  const scoreKKE21 = kke21_keterkaitan * 0.3 + kke21_sasaran * 0.3 + kke21_indikator * 0.2 + kke21_target * 0.2;

  // Kualitas Sasaran Kegiatan (KKE 2.2)
  const kke22_keterkaitan = getKkeRatio('KKE_2.2', 'keterkaitan');
  const kke22_sasaran = getKkeRatio('KKE_2.2', 'sasaran_tepat');
  const kke22_indikator = getKkeRatio('KKE_2.2', 'indikator_tepat');
  const kke22_target = getKkeRatio('KKE_2.2', 'target_tepat');
  const scoreKKE22 = kke22_keterkaitan * 0.3 + kke22_sasaran * 0.3 + kke22_indikator * 0.2 + kke22_target * 0.2;

  // Kualitas Sasaran Sub Kegiatan (KKE 2.3)
  const kke23_keterkaitan = getKkeRatio('KKE_2.3', 'keterkaitan');
  const kke23_indikator = getKkeRatio('KKE_2.3', 'indikator_tepat');
  const kke23_target = getKkeRatio('KKE_2.3', 'target_tepat');
  const scoreKKE23 = kke23_keterkaitan * 0.4 + kke23_indikator * 0.3 + kke23_target * 0.3;

  // Aggregate KK2 Score (Kualitas Strategi)
  const scoreKK2 = scoreKKE21 * (1/3) + scoreKKE22 * (1/3) + scoreKKE23 * (1/3);
  const levelKK2 = scoreKK2 > 0.90 ? 5 : scoreKK2 > 0.80 ? 4 : scoreKK2 > 0.70 ? 3 : scoreKK2 > 0.60 ? 2 : 1;

  // Final Penetapan Tujuan Score (KKLEAD_SPIP row 15)
  const scorePenetapanTujuan = (levelKK1 * 0.5) + (levelKK2 * 0.5);

  // Compile Subelements scores for KKLEAD II / KKLEAD_SPIP
  const spipSubScores = {};
  Object.keys(SUBELEMENT_LABELS).forEach(subCode => {
    spipSubScores[subCode] = {
      T1: getSubelementAggregateScore(subCode, 'T1'),
      T2: getSubelementAggregateScore(subCode, 'T2'),
      T3: getSubelementAggregateScore(subCode, 'T3'),
      T4: getSubelementAggregateScore(subCode, 'T4')
    };
    // Subelement Average
    const valid = Object.values(spipSubScores[subCode]).filter(v => v !== null);
    spipSubScores[subCode].Avg = valid.length > 0 ? valid.reduce((s, v) => s + v, 0) / valid.length : 1;
  });

  // Calculate Component sub-sums under Struktur dan Proses (KKLEAD_SPIP rows 20-48)
  const getComponentSubSum = (subCodes) => {
    const weights = {
      T1: 0.0375, T2: 0.0375, T3: 0.0375, T4: 0.0375 // fallback
    };
    // Subelement weights are component weight / subelements count
    // Lingkungan Pengendalian: weight 30% / 8 subelements = 0.0375 each
    // Penilaian Risiko: weight 20% / 2 = 0.10 each
    // Kegiatan Pengendalian: weight 25% / 11 = 0.022727 each
    // Informasi & Komunikasi: weight 10% / 2 = 0.05 each
    // Pemantauan: weight 15% / 2 = 0.075 each
    let sumWeighted = 0;
    subCodes.forEach(code => {
      let weight = 0.022727;
      if (['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'].includes(code)) weight = 0.0375;
      else if (['2.1', '2.2'].includes(code)) weight = 0.10;
      else if (['4.1', '4.2'].includes(code)) weight = 0.05;
      else if (['5.1', '5.2'].includes(code)) weight = 0.075;

      sumWeighted += spipSubScores[code].Avg * weight;
    });
    return sumWeighted;
  };

  const scoreStrukturProses = 
    getComponentSubSum(['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8']) +
    getComponentSubSum(['2.1', '2.2']) +
    getComponentSubSum(['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11']) +
    getComponentSubSum(['4.1', '4.2']) +
    getComponentSubSum(['5.1', '5.2']);

  // Compile Achievements for KKLEAD III
  const getAchievementPayload = (type) => {
    const row = achievements.find(a => a.kk_type === type && a.fiscal_year === selectedYear);
    const payload = row?.data_payload || {};
    return payload.summary || payload || {};
  };

  // Outcome score: Pemda Outcome + OPD Outcome / 2
  const ach51a = getAchievementPayload('KK5.1A');
  const ach51b = getAchievementPayload('KK5.1B');
  const ach52 = getAchievementPayload('KK5.2');

  const scoreOutcomePemda = GRADE_TO_SCORE[ach51a.pemda_outcome] || 5;
  const scoreOutcomeOpd = GRADE_TO_SCORE[ach51b.opd_outcome] || 4;
  
  // In Excel: E54 = 'KKLEAD III'!G8 + 'KKLEAD III'!G9 / 2 (which is 5 + 4/2 = 7).
  const valOutcome = calculationMode === 'emulation' ? (scoreOutcomePemda + scoreOutcomeOpd / 2) : (scoreOutcomePemda + scoreOutcomeOpd) / 2;

  const scoreOutput = GRADE_TO_SCORE[ach52.output] || 3;
  
  const ach6 = getAchievementPayload('KK6');
  const scoreOpini = ach6.opini_2025 === 'WTP' ? 5 : ach6.opini_2025 === 'WDP' ? 4 : 3;

  const ach7 = getAchievementPayload('KK7');
  const scoreAset = GRADE_TO_SCORE[ach7.temuan_aset] || 3;

  const ach8 = getAchievementPayload('KK8');
  // Ketaatan score
  const scoreKetaatan = 5 - (ach8.temuan_count || 1); // 1 = E = 1. 0 = A = 5.
  const scoreKetaatanCapped = Math.max(1, Math.min(5, scoreKetaatan));

  // Sub-jumlah Pencapaian Tujuan (KKLEAD_SPIP row 63)
  // G54 (Outcome) weight 0.2
  // G55 (Output) weight 0.1
  // G57 (Opini) weight 0.25
  // G59 (Aset) weight 0.25
  // G61 (Ketaatan) weight 0.2
  const scorePencapaianTujuan = 
    valOutcome * 0.2 +
    scoreOutput * 0.1 +
    scoreOpini * 0.25 +
    scoreAset * 0.25 +
    scoreKetaatanCapped * 0.2;

  // Final SPIP Maturity score (KKLEAD_SPIP row 11)
  // Penetapan Tujuan (weight 0.4) + Struktur & Proses (weight 0.3) + Pencapaian Tujuan (weight 0.3)
  const spipMaturity = 
    (scorePenetapanTujuan * 0.4) + 
    (scoreStrukturProses * 0.3) + 
    (scorePencapaianTujuan * 0.3);

  // --- Calculate MRI (Manajemen Risiko Indeks) ---
  const E75_kepemimpinan = 
    spipSubScores['1.3'].Avg * 3 + (spipSubScores['4.1'].Avg / 4); // buggy formula: L21 + L22 + L23 + L75/4
  const E76_kebijakan = spipSubScores['2.1'].Avg;
  const E77_sdm = spipSubScores['1.6'].Avg;
  const E78_kemitraan = spipSubScores['1.8'].Avg;
  
  // Proses MR average: average of 10 items
  const E79_proses = (
    spipSubScores['2.1'].Avg * 2 + 
    spipSubScores['2.2'].Avg * 3 + 
    spipSubScores['4.1'].Avg * 2 + 
    spipSubScores['5.1'].Avg * 2 + 
    spipSubScores['5.2'].Avg
  ) / 10;

  const scoreKapabilitasMR = 
    E75_kepemimpinan * 0.05 + 
    E76_kebijakan * 0.05 + 
    E77_sdm * 0.05 + 
    E78_kemitraan * 0.025 + 
    E79_proses * 0.125;

  const scoreHasilMR = 
    spipSubScores['2.2'].Avg * 0.1875 + // penanganan risiko
    valOutcome * 0.1125; // outcomes

  const mriIndex = 
    (scorePenetapanTujuan * 0.4) + // Perencanaan
    scoreKapabilitasMR + 
    scoreHasilMR;

  // --- Calculate IEPK (Indeks Efektivitas Pencegahan Korupsi) ---
  const iepkKapabilitas = 
    (5 + 4 + 5 + 4 + 4) / 5; // policies and anti-corruption systems parameters (hardcoded or averaged from subelements)
  const iepkPenerapan = 
    (3 + 3 + 5 + 3 + 4) / 5;
  const iepkPenanganan = 
    (4 + 4) / 2;

  const iepkIndex = 
    iepkKapabilitas * 0.48 + 
    iepkPenerapan * 0.36 + 
    iepkPenanganan * 0.16;


  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-sky-600" />
          <p className="text-xs text-slate-500">Mengkalkulasi Maturitas SPIP & Indeks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner Control Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 rounded-2xl border border-slate-700/50 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl -mr-20 -mt-20"></div>
        
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Kertas Kerja Elektronik (KKE) SPIP Terintegrasi
          </h1>
          <p className="text-xs text-slate-400">
            Daftar evaluasi mandiri daerah Provinsi Lampung untuk Penyelenggaraan SPIP, MRI, dan IEPK Tahun 2026.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          {/* OPD Selector (Admin/Coordinators only) */}
          {['ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT'].includes(userRole) && (
            <div className="flex items-center space-x-2 bg-slate-850 border border-slate-700 rounded-xl px-3 py-1.5 shadow-inner">
              <Building2 size={15} className="text-slate-400" />
              <select
                value={selectedOpdScope}
                onChange={(e) => setSelectedOpdScope(e.target.value)}
                className="bg-transparent text-xs text-slate-100 focus:outline-none cursor-pointer pr-4"
              >
                <option value="pemda" className="bg-slate-800 text-white">Konsolidasi Pemda (Seluruh Dinas)</option>
                {opds.map(opd => (
                  <option key={opd.id} value={opd.id} className="bg-slate-800 text-white">{opd.name_opd}</option>
                ))}
              </select>
            </div>
          )}

          {/* Formula Mode Toggle */}
          <div className="flex items-center space-x-2 bg-slate-850 border border-slate-700 rounded-xl px-3 py-1.5">
            <Sliders size={14} className="text-slate-400" />
            <button 
              onClick={toggleCalculationMode}
              className="text-xs transition-colors flex items-center space-x-2"
            >
              {calculationMode === 'emulation' ? (
                <span className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                  <span>BPKP Emulation Mode</span>
                  <ToggleLeft size={20} className="text-amber-400" />
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <span>Correct Math Mode</span>
                  <ToggleRight size={20} className="text-emerald-400" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm space-x-1">
        {[
          { id: 'spip', name: 'Simpulan Maturitas (KKLEAD_SPIP)' },
          { id: 'kklead1', name: 'Kualitas Perencanaan (KKLEAD I)' },
          { id: 'kklead2', name: 'Struktur & Proses (KKLEAD II)' },
          { id: 'kklead3', name: 'Pencapaian Tujuan (KKLEAD III)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-center text-xs font-bold rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      
      {/* 1. TAB: SIMPULAN MATURITAS (KKLEAD_SPIP) */}
      {activeTab === 'spip' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Level Index Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[120px]">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Maturitas SPIP</span>
                <span className="text-3xl font-black text-slate-800 mt-1">{spipMaturity.toFixed(4)}</span>
              </div>
              <span className="text-[10px] text-sky-600 font-extrabold uppercase mt-2">Level 4 (Terkelola)</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[120px]">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Indeks MRI</span>
                <span className="text-3xl font-black text-slate-800 mt-1">{mriIndex.toFixed(4)}</span>
              </div>
              <span className="text-[10px] text-teal-600 font-extrabold uppercase mt-2">Sangat Baik</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[120px]">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Indeks IEPK</span>
                <span className="text-3xl font-black text-slate-800 mt-1">{iepkIndex.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-extrabold uppercase mt-2">Kategori Tinggi</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[120px]">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kapabilitas APIP</span>
                <span className="text-3xl font-black text-slate-800 mt-1">4.0000</span>
              </div>
              <span className="text-[10px] text-amber-600 font-extrabold uppercase mt-2">Level 4 (Terkelola)</span>
            </div>
          </div>

          {/* Detailed SPIP Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Simpulan Nilai Maturitas Penyelenggaraan SPIP</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-150">
                    <th className="p-4 w-[250px]">Komponen &amp; Unsur Penilaian</th>
                    <th className="p-4 text-center">Bobot Unsur</th>
                    <th className="p-4 text-center">Skor Unsur</th>
                    <th className="p-4 text-center">Bobot Komponen</th>
                    <th className="p-4 text-center">Nilai Unsur</th>
                    <th className="p-4 text-center">Nilai Komponen</th>
                    <th className="p-4 text-center">Nilai Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {/* PENETAPAN TUJUAN */}
                  <tr className="bg-sky-50/30 font-bold text-slate-700">
                    <td className="p-4">I. PENETAPAN TUJUAN</td>
                    <td colSpan="2"></td>
                    <td className="p-4 text-center">40%</td>
                    <td colSpan="2"></td>
                    <td className="p-4 text-center">{(scorePenetapanTujuan * 0.4).toFixed(4)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8">1. Kualitas Sasaran Strategis</td>
                    <td className="p-4 text-center">0.5</td>
                    <td className="p-4 text-center">{levelKK1.toFixed(2)}</td>
                    <td></td>
                    <td className="p-4 text-center">{(levelKK1 * 0.5).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 border-b-2 border-slate-200">
                    <td className="p-4 pl-8">2. Kualitas Strategi Pencapaian Sasaran</td>
                    <td className="p-4 text-center">0.5</td>
                    <td className="p-4 text-center">{levelKK2.toFixed(2)}</td>
                    <td></td>
                    <td className="p-4 text-center">{(levelKK2 * 0.5).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>

                  {/* STRUKTUR DAN PROSES */}
                  <tr className="bg-emerald-50/20 font-bold text-slate-700">
                    <td className="p-4">II. STRUKTUR DAN PROSES</td>
                    <td colSpan="2"></td>
                    <td className="p-4 text-center">30%</td>
                    <td colSpan="2"></td>
                    <td className="p-4 text-center">{(scoreStrukturProses * 0.3).toFixed(4)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">A. Lingkungan Pengendalian</td>
                    <td colSpan="3"></td>
                    <td className="p-4 text-center">{(getComponentSubSum(['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'])).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  {['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'].map(code => (
                    <tr key={code} className="text-slate-500 hover:bg-slate-50/30">
                      <td className="p-3 pl-12">{code} - {SUBELEMENT_LABELS[code]}</td>
                      <td className="p-3 text-center">0.0375</td>
                      <td className="p-3 text-center">{(spipSubScores[code]?.Avg || 0).toFixed(4)}</td>
                      <td></td>
                      <td className="p-3 text-center">{((spipSubScores[code]?.Avg || 0) * 0.0375).toFixed(4)}</td>
                      <td colSpan="2"></td>
                    </tr>
                  ))}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">B. Penilaian Risiko</td>
                    <td colSpan="3"></td>
                    <td className="p-4 text-center">{(getComponentSubSum(['2.1', '2.2'])).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  {['2.1', '2.2'].map(code => (
                    <tr key={code} className="text-slate-500 hover:bg-slate-50/30">
                      <td className="p-3 pl-12">{code} - {SUBELEMENT_LABELS[code]}</td>
                      <td className="p-3 text-center">0.1000</td>
                      <td className="p-3 text-center">{(spipSubScores[code]?.Avg || 0).toFixed(4)}</td>
                      <td></td>
                      <td className="p-3 text-center">{((spipSubScores[code]?.Avg || 0) * 0.10).toFixed(4)}</td>
                      <td colSpan="2"></td>
                    </tr>
                  ))}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">C. Kegiatan Pengendalian</td>
                    <td colSpan="3"></td>
                    <td className="p-4 text-center">{(getComponentSubSum(['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11'])).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  {['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11'].map(code => (
                    <tr key={code} className="text-slate-500 hover:bg-slate-50/30">
                      <td className="p-3 pl-12">{code} - {SUBELEMENT_LABELS[code]}</td>
                      <td className="p-3 text-center">0.0227</td>
                      <td className="p-3 text-center">{(spipSubScores[code]?.Avg || 0).toFixed(4)}</td>
                      <td></td>
                      <td className="p-3 text-center">{((spipSubScores[code]?.Avg || 0) * 0.022727).toFixed(4)}</td>
                      <td colSpan="2"></td>
                    </tr>
                  ))}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">D. Informasi dan Komunikasi</td>
                    <td colSpan="3"></td>
                    <td className="p-4 text-center">{(getComponentSubSum(['4.1', '4.2'])).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  {['4.1', '4.2'].map(code => (
                    <tr key={code} className="text-slate-500 hover:bg-slate-50/30">
                      <td className="p-3 pl-12">{code} - {SUBELEMENT_LABELS[code]}</td>
                      <td className="p-3 text-center">0.0500</td>
                      <td className="p-3 text-center">{(spipSubScores[code]?.Avg || 0).toFixed(4)}</td>
                      <td></td>
                      <td className="p-3 text-center">{((spipSubScores[code]?.Avg || 0) * 0.05).toFixed(4)}</td>
                      <td colSpan="2"></td>
                    </tr>
                  ))}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">E. Pemantauan</td>
                    <td colSpan="3"></td>
                    <td className="p-4 text-center">{(getComponentSubSum(['5.1', '5.2'])).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  {['5.1', '5.2'].map(code => (
                    <tr key={code} className="text-slate-500 hover:bg-slate-50/30 border-b-2 border-slate-200">
                      <td className="p-3 pl-12">{code} - {SUBELEMENT_LABELS[code]}</td>
                      <td className="p-3 text-center">0.0750</td>
                      <td className="p-3 text-center">{(spipSubScores[code]?.Avg || 0).toFixed(4)}</td>
                      <td></td>
                      <td className="p-3 text-center">{((spipSubScores[code]?.Avg || 0) * 0.075).toFixed(4)}</td>
                      <td colSpan="2"></td>
                    </tr>
                  ))}

                  {/* PENCAPAIAN TUJUAN */}
                  <tr className="bg-indigo-50/20 font-bold text-slate-700 border-b-2 border-slate-300">
                    <td className="p-4">III. PENCAPAIAN TUJUAN</td>
                    <td colSpan="2"></td>
                    <td className="p-4 text-center">30%</td>
                    <td colSpan="2"></td>
                    <td className="p-4 text-center">{(scorePencapaianTujuan * 0.3).toFixed(4)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">A. Efektivitas &amp; Efisiensi</td>
                    <td colSpan="5"></td>
                  </tr>
                  <tr className="text-slate-500 hover:bg-slate-50/30">
                    <td className="p-3 pl-12">1. Capaian Outcome</td>
                    <td className="p-3 text-center">0.2000</td>
                    <td className="p-3 text-center">{valOutcome.toFixed(2)}</td>
                    <td></td>
                    <td className="p-3 text-center">{(valOutcome * 0.2).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr className="text-slate-500 hover:bg-slate-50/30">
                    <td className="p-3 pl-12">2. Capaian Output</td>
                    <td className="p-3 text-center">0.1000</td>
                    <td className="p-3 text-center">{scoreOutput.toFixed(2)}</td>
                    <td></td>
                    <td className="p-3 text-center">{(scoreOutput * 0.1).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">B. Keandalan Laporan Keuangan</td>
                    <td colSpan="5"></td>
                  </tr>
                  <tr className="text-slate-500 hover:bg-slate-50/30">
                    <td className="p-3 pl-12">1. Opini Laporan Keuangan (LHP BPK)</td>
                    <td className="p-3 text-center">0.2500</td>
                    <td className="p-3 text-center">{scoreOpini.toFixed(2)}</td>
                    <td></td>
                    <td className="p-3 text-center">{(scoreOpini * 0.25).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">C. Pengamanan Aset Negara/Daerah</td>
                    <td colSpan="5"></td>
                  </tr>
                  <tr className="text-slate-500 hover:bg-slate-50/30">
                    <td className="p-3 pl-12">1. Catatan / Temuan Hukum Aset Negara</td>
                    <td className="p-3 text-center">0.2500</td>
                    <td className="p-3 text-center">{scoreAset.toFixed(2)}</td>
                    <td></td>
                    <td className="p-3 text-center">{(scoreAset * 0.25).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 pl-8 font-semibold text-slate-600">D. Ketaatan terhadap Peraturan Perundangan</td>
                    <td colSpan="5"></td>
                  </tr>
                  <tr className="text-slate-500 hover:bg-slate-50/30 border-b-4 border-slate-350">
                    <td className="p-3 pl-12">1. Temuan Ketaatan pada LHP BPK</td>
                    <td className="p-3 text-center">0.2000</td>
                    <td className="p-3 text-center">{scoreKetaatanCapped.toFixed(2)}</td>
                    <td></td>
                    <td className="p-3 text-center">{(scoreKetaatanCapped * 0.2).toFixed(4)}</td>
                    <td colSpan="2"></td>
                  </tr>

                  {/* FINAL SUM */}
                  <tr className="bg-sky-600 text-white font-extrabold text-sm border-t border-slate-200">
                    <td className="p-4" colSpan="6">NILAI AKHIR MATURITAS SPIP (TEMPO/BPKP)</td>
                    <td className="p-4 text-center">{spipMaturity.toFixed(4)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: KUALITAS PERENCANAAN (KKLEAD I) */}
      {activeTab === 'kklead1' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Kertas Kerja Penilaian Kualitas Perencanaan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 w-[60px]">No</th>
                  <th className="p-4">Uraian Evaluasi Perencanaan</th>
                  <th className="p-4 text-center w-[120px]">Bobot Sub</th>
                  <th className="p-4 text-center w-[120px]">Skor Sub</th>
                  <th className="p-4 text-center w-[120px]">Skor Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {/* SECTION A */}
                <tr className="bg-slate-100 font-extrabold">
                  <td className="p-4" colSpan="5">A. KUALITAS SASARAN STRATEGIS (KK1)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold">1</td>
                  <td className="p-4 font-semibold">Sasaran Strategis Pemda (KKE 1.1)</td>
                  <td className="p-4 text-center">0.5000</td>
                  <td className="p-4 text-center">{scoreKKE11.toFixed(4)}</td>
                  <td className="p-4 text-center">{(scoreKKE11 * 0.5).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">a. Sasaran Pemda Tepat (KKE 1.1 Col F)</td>
                  <td className="p-3 text-center">0.4000</td>
                  <td className="p-3 text-center">{kke11_sasaran.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke11_sasaran * 0.4).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">b. Indikator Kinerja Pemda Tepat (KKE 1.1 Col K)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke11_indikator.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke11_indikator * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20 border-b border-slate-150">
                  <td></td>
                  <td className="p-3 pl-8">c. Target Kinerja Pemda SMART (KKE 1.1 Col P)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke11_target.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke11_target * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold">2</td>
                  <td className="p-4 font-semibold">Sasaran Strategis OPD (KKE 1.2)</td>
                  <td className="p-4 text-center">0.5000</td>
                  <td className="p-4 text-center">{scoreKKE12.toFixed(4)}</td>
                  <td className="p-4 text-center">{(scoreKKE12 * 0.5).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">a. Keterkaitan dengan Sasaran Pemda (KKE 1.2 Col I)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke12_keterkaitan.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke12_keterkaitan * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">b. Sasaran OPD Tepat (KKE 1.2 Col N)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke12_sasaran.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke12_sasaran * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">c. Indikator Kinerja OPD Tepat (KKE 1.2 Col S)</td>
                  <td className="p-3 text-center">0.2000</td>
                  <td className="p-3 text-center">{kke12_indikator.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke12_indikator * 0.2).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20 border-b-2 border-slate-200">
                  <td></td>
                  <td className="p-3 pl-8">d. Target Kinerja OPD SMART (KKE 1.2 Col X)</td>
                  <td className="p-3 text-center">0.2000</td>
                  <td className="p-3 text-center">{kke12_target.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke12_target * 0.2).toFixed(4)}</td>
                </tr>
                <tr className="bg-sky-50 font-bold text-slate-700">
                  <td className="p-4" colSpan="2">TOTAL SKOR KUALITAS SASRAN (KK1)</td>
                  <td colSpan="2"></td>
                  <td className="p-4 text-center">{scoreKK1.toFixed(4)}</td>
                </tr>
                <tr className="bg-sky-100 font-extrabold text-sky-700 border-b-4 border-slate-200">
                  <td className="p-4" colSpan="2">LEVEL EVALUASI CASCADING SASARAN (KK1)</td>
                  <td colSpan="2"></td>
                  <td className="p-4 text-center">Level {levelKK1}</td>
                </tr>

                {/* SECTION B */}
                <tr className="bg-slate-100 font-extrabold">
                  <td className="p-4" colSpan="5">B. KUALITAS STRATEGI PENCAPAIAN SASARAN (KK2)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold">1</td>
                  <td className="p-4 font-semibold">Kualitas Sasaran Program (KKE 2.1)</td>
                  <td className="p-4 text-center">0.3333</td>
                  <td className="p-4 text-center">{scoreKKE21.toFixed(4)}</td>
                  <td className="p-4 text-center">{(scoreKKE21 * (1/3)).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">a. Keterkaitan dengan Sasaran OPD (KKE 2.1 Col L)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke21_keterkaitan.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke21_keterkaitan * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">b. Sasaran Program Tepat (KKE 2.1 Col Q)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke21_sasaran.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke21_sasaran * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">c. Indikator Program Tepat (KKE 2.1 Col V)</td>
                  <td className="p-3 text-center">0.2000</td>
                  <td className="p-3 text-center">{kke21_indikator.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke21_indikator * 0.2).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20 border-b border-slate-150">
                  <td></td>
                  <td className="p-3 pl-8">d. Target Program SMART (KKE 2.1 Col AA)</td>
                  <td className="p-3 text-center">0.2000</td>
                  <td className="p-3 text-center">{kke21_target.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke21_target * 0.2).toFixed(4)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold">2</td>
                  <td className="p-4 font-semibold">Kualitas Sasaran Kegiatan (KKE 2.2)</td>
                  <td className="p-4 text-center">0.3333</td>
                  <td className="p-4 text-center">{scoreKKE22.toFixed(4)}</td>
                  <td className="p-4 text-center">{(scoreKKE22 * (1/3)).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">a. Keterkaitan dengan Program (KKE 2.2 Col P)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke22_keterkaitan.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke22_keterkaitan * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">b. Sasaran Kegiatan Tepat (KKE 2.2 Col U)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke22_sasaran.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke22_sasaran * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">c. Indikator Kegiatan Tepat (KKE 2.2 Col Z)</td>
                  <td className="p-3 text-center">0.2000</td>
                  <td className="p-3 text-center">{kke22_indikator.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke22_indikator * 0.2).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20 border-b border-slate-150">
                  <td></td>
                  <td className="p-3 pl-8">d. Target Kegiatan SMART (KKE 2.2 Col AE)</td>
                  <td className="p-3 text-center">0.2000</td>
                  <td className="p-3 text-center">{kke22_target.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke22_target * 0.2).toFixed(4)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold">3</td>
                  <td className="p-4 font-semibold">Kualitas Sasaran Sub Kegiatan (KKE 2.3)</td>
                  <td className="p-4 text-center">0.3333</td>
                  <td className="p-4 text-center">{scoreKKE23.toFixed(4)}</td>
                  <td className="p-4 text-center">{(scoreKKE23 * (1/3)).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">a. Keterkaitan dengan Kegiatan (KKE 2.3 Col S)</td>
                  <td className="p-3 text-center">0.4000</td>
                  <td className="p-3 text-center">{kke23_keterkaitan.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke23_keterkaitan * 0.4).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20">
                  <td></td>
                  <td className="p-3 pl-8">b. Indikator Sub Kegiatan Tepat (KKE 2.3 Col X)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke23_indikator.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke23_indikator * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="text-slate-500 hover:bg-slate-50/20 border-b-2 border-slate-200">
                  <td></td>
                  <td className="p-3 pl-8">c. Target Sub Kegiatan SMART (KKE 2.3 Col AC)</td>
                  <td className="p-3 text-center">0.3000</td>
                  <td className="p-3 text-center">{kke23_target.toFixed(4)}</td>
                  <td className="p-3 text-center">{(kke23_target * 0.3).toFixed(4)}</td>
                </tr>
                <tr className="bg-sky-50 font-bold text-slate-700">
                  <td className="p-4" colSpan="2">TOTAL SKOR KUALITAS PENCAPAIAN STRATEGI (KK2)</td>
                  <td colSpan="2"></td>
                  <td className="p-4 text-center">{scoreKK2.toFixed(4)}</td>
                </tr>
                <tr className="bg-sky-100 font-extrabold text-sky-700">
                  <td className="p-4" colSpan="2">LEVEL EVALUASI PROGRAM &amp; KEGIATAN (KK2)</td>
                  <td colSpan="2"></td>
                  <td className="p-4 text-center">Level {levelKK2}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: STRUKTUR & PROSES (KKLEAD II) */}
      {activeTab === 'kklead2' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Kertas Kerja Penilaian Struktur dan Proses (KKLEAD II)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px] leading-relaxed">
              <thead>
                <tr className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3 w-[60px]">Kode</th>
                  <th className="p-3 w-[200px]">Uraian Subunsur / Parameter</th>
                  <th className="p-3 text-center w-[50px]">No</th>
                  <th className="p-3 text-center w-[60px]">Pilar 2E</th>
                  <th className="p-3 text-center w-[60px]">Keuangan</th>
                  <th className="p-3 text-center w-[60px]">Aset</th>
                  <th className="p-3 text-center w-[60px]">Ketaatan</th>
                  <th className="p-3 text-center w-[80px]">Kesimpulan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {Object.keys(SUBELEMENT_LABELS).map(subCode => {
                  const headerRow = (
                    <tr key={`${subCode}-header`} className="bg-slate-50/80 font-bold text-slate-700 border-t border-slate-200">
                      <td className="p-3 font-semibold">{subCode}</td>
                      <td className="p-3 font-semibold">{SUBELEMENT_LABELS[subCode]}</td>
                      <td className="p-3 text-center"></td>
                      <td className="p-3 text-center text-sky-700">
                        {spipSubScores[subCode].T1 !== null ? spipSubScores[subCode].T1.toFixed(2) : '-'}
                      </td>
                      <td className="p-3 text-center text-sky-700">
                        {spipSubScores[subCode].T2 !== null ? spipSubScores[subCode].T2.toFixed(2) : '-'}
                      </td>
                      <td className="p-3 text-center text-sky-700">
                        {spipSubScores[subCode].T3 !== null ? spipSubScores[subCode].T3.toFixed(2) : '-'}
                      </td>
                      <td className="p-3 text-center text-sky-700">
                        {spipSubScores[subCode].T4 !== null ? spipSubScores[subCode].T4.toFixed(2) : '-'}
                      </td>
                      <td className="p-3 text-center bg-sky-50 text-sky-700 font-extrabold">
                        {spipSubScores[subCode].Avg !== null ? spipSubScores[subCode].Avg.toFixed(4) : '-'}
                      </td>
                    </tr>
                  );

                  const paramRows = (SUBELEMENT_PARAMETERS[subCode] || []).map(p => {
                    const t1Score = getParamScore(subCode, p.no, 'T1');
                    const t2Score = getParamScore(subCode, p.no, 'T2');
                    const t3Score = getParamScore(subCode, p.no, 'T3');
                    const t4Score = getParamScore(subCode, p.no, 'T4');

                    // Subelement Parameter Average
                    const scores = [t1Score, t2Score, t3Score, t4Score].filter(v => v !== null);
                    const avg = scores.length > 0 ? scores.reduce((s, v) => s + v, 0) / scores.length : null;

                    return (
                      <tr key={`${subCode}-p-${p.no}`} className="text-slate-500 hover:bg-slate-50/30">
                        <td className="p-2 text-slate-400 pl-4">{subCode}</td>
                        <td className="p-2 pl-4 text-slate-600">{p.desc}</td>
                        <td className="p-2 text-center text-slate-400 font-semibold">{p.no}</td>
                        <td className="p-2 text-center">{t1Score !== null ? t1Score : '-'}</td>
                        <td className="p-2 text-center">{t2Score !== null ? t2Score : '-'}</td>
                        <td className="p-2 text-center">{t3Score !== null ? t3Score : '-'}</td>
                        <td className="p-2 text-center">{t4Score !== null ? t4Score : '-'}</td>
                        <td className="p-2 text-center bg-slate-50/50">{avg !== null ? avg.toFixed(2) : '-'}</td>
                      </tr>
                    );
                  });

                  return [headerRow, ...paramRows];
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: PENCAPAIAN TUJUAN (KKLEAD III) */}
      {activeTab === 'kklead3' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Kertas Kerja Penilaian Pencapaian Tujuan (KKLEAD III)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 w-[60px]">No</th>
                  <th className="p-4">Indikator Pencapaian Tujuan</th>
                  <th className="p-4">Definisi &amp; Cara Pengukuran</th>
                  <th className="p-4 text-center w-[150px]">Capaian Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                <tr className="bg-slate-50 font-bold">
                  <td className="p-4" colSpan="4">A. EFEKTIVITAS DAN EFISIENSI</td>
                </tr>
                 <tr className="hover:bg-slate-50/50">
                  <td className="p-4">1.</td>
                  <td className="p-4">
                    <span className="font-semibold block text-slate-800">Capaian Outcome Sasaran Pemda &amp; OPD</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Mengukur efektivitas pencapaian target regional (KK5.1 A &amp; B)</span>
                  </td>
                  <td className="p-4 text-slate-500 leading-relaxed">
                    Nilai Pemda: <strong>{ach51a.pemda_outcome || 'A'}</strong> (Grade {scoreOutcomePemda}) <br />
                    Nilai OPD: <strong>{ach51b.opd_outcome || 'B'}</strong> (Grade {scoreOutcomeOpd})
                  </td>
                  <td className="p-4 text-center font-extrabold text-sky-700 bg-sky-50/30 text-sm">
                    {valOutcome.toFixed(2)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 border-b border-slate-150">
                  <td className="p-4">2.</td>
                  <td className="p-4">
                    <span className="font-semibold block text-slate-800">Capaian Output Kegiatan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Mengukur efisiensi output program unit kerja (KK5.2)</span>
                  </td>
                  <td className="p-4 text-slate-500 leading-relaxed">
                    Tingkat pencapaian output dinilai pada Grade <strong>{ach52.output || 'C'}</strong>.
                  </td>
                  <td className="p-4 text-center font-extrabold text-sky-700 bg-sky-50/30 text-sm">
                    {scoreOutput.toFixed(2)}
                  </td>
                </tr>

                <tr className="bg-slate-50 font-bold">
                  <td className="p-4" colSpan="4">B. KEANDALAN PELAPORAN KEUANGAN</td>
                </tr>
                <tr className="hover:bg-slate-50/50 border-b border-slate-150">
                  <td className="p-4">1.</td>
                  <td className="p-4">
                    <span className="font-semibold block text-slate-800">Opini atas Laporan Keuangan – BPK RI</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Penilaian kewajaran penyajian LKPD oleh BPK RI (KK6)</span>
                  </td>
                  <td className="p-4 text-slate-500 leading-relaxed">
                    Tahun 2025: <strong>{ach6.opini_2025 || 'WTP'}</strong> <br />
                    Tahun 2024: <strong>{ach6.opini_2024 || 'WTP'}</strong>
                  </td>
                  <td className="p-4 text-center font-extrabold text-sky-700 bg-sky-50/30 text-sm">
                    {scoreOpini.toFixed(2)}
                  </td>
                </tr>

                <tr className="bg-slate-50 font-bold">
                  <td className="p-4" colSpan="4">C. PENGAMANAN ATAS ASET NEGARA/DAERAH</td>
                </tr>
                <tr className="hover:bg-slate-50/50 border-b border-slate-150">
                  <td className="p-4">1.</td>
                  <td className="p-4">
                    <span className="font-semibold block text-slate-800">Kualitas Pengamanan Aset Daerah</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Catatan pengamanan fisik dan administrasi aset (KK7)</span>
                  </td>
                  <td className="p-4 text-slate-500 leading-relaxed">
                    Kondisi Aset Baik: <strong>{ach7.kondisi_baik || '90'}%</strong> <br />
                    Uraian: <span className="text-slate-400">{ach7.uraian_aset || '-'}</span>
                  </td>
                  <td className="p-4 text-center font-extrabold text-sky-700 bg-sky-50/30 text-sm">
                    {scoreAset.toFixed(2)}
                  </td>
                </tr>

                <tr className="bg-slate-50 font-bold">
                  <td className="p-4" colSpan="4">D. KETAATAN TERHADAP PERATURAN PERUNDANGAN</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4">1.</td>
                  <td className="p-4">
                    <span className="font-semibold block text-slate-800">Jumlah Temuan Ketidakpatuhan Hukum</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Banyaknya temuan kepatuhan peraturan perundangan pada LHP BPK (KK8)</span>
                  </td>
                  <td className="p-4 text-slate-500 leading-relaxed">
                    Banyaknya temuan BPK: <strong>{ach8.temuan_count || 1}</strong>
                  </td>
                  <td className="p-4 text-center font-extrabold text-sky-700 bg-sky-50/30 text-sm">
                    {scoreKetaatanCapped.toFixed(2)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 border-b border-slate-200">
                  <td className="p-4">2.</td>
                  <td className="p-4">
                    <span className="font-semibold block text-slate-800">Keterjadian Tindak Pidana Korupsi</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Kasus korupsi yang melibatkan pejabat eselon I/II/Politis (KK8)</span>
                  </td>
                  <td className="p-4 text-slate-500 leading-relaxed">
                    Kejadian Korupsi: <span className="font-bold text-red-600">{ach8.korupsi || 'Tidak'}</span>
                  </td>
                  <td className="p-4 text-center font-extrabold text-slate-400 bg-slate-50/30">
                    Tidak Dinilai (IEPK)
                  </td>
                </tr>
                <tr className="bg-sky-50 font-bold text-slate-700">
                  <td className="p-4" colSpan="3">SUB JUMLAH PENCAPAIAN TUJUAN (KKLEAD III)</td>
                  <td className="p-4 text-center text-sm font-extrabold text-sky-700 bg-sky-50">{scorePencapaianTujuan.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
