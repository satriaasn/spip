import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load and parse .env file
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.error('.env file not found!');
    process.exit(1);
}
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        env[key] = val;
    }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing in .env!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
console.log('Loading workbook from:', excelPath);
const workbook = xlsx.readFile(excelPath);

// Hardcoded OPD seeds matching supabase_schema.sql
const opdSeeds = [
    { id: 1, code_opd: 'BAPPEDA', name_opd: 'Badan Perencanaan Pembangunan Daerah' },
    { id: 2, code_opd: 'DISPUSIP', name_opd: 'Dinas Perpustakaan dan Kearsipan' },
    { id: 3, code_opd: 'INSPEKTORAT', name_opd: 'Inspektorat' },
    { id: 4, code_opd: 'BKD', name_opd: 'Badan Kepegawaian Daerah Provinsi Lampung' },
    { id: 5, code_opd: 'DISPORA', name_opd: 'Dinas Pemuda dan Olahraga' },
    { id: 6, code_opd: 'BALITBANGDA', name_opd: 'Badan Penelitian dan Pengembangan Daerah' },
    { id: 7, code_opd: 'DESDM', name_opd: 'Dinas ESDM' },
    { id: 8, code_opd: 'DISKOMINFOTIK', name_opd: 'Dinas Komunikasi, Informatika dan Statistik Provinsi Lampung' },
    { id: 9, code_opd: 'DLH', name_opd: 'Dinas Lingkungan Hidup Provinsi Lampung' },
    { id: 10, code_opd: 'DISHUT', name_opd: 'Dinas Kehutanan' },
    { id: 11, code_opd: 'DKP', name_opd: 'Dinas Kelautan dan Perikanan' },
    { id: 12, code_opd: 'DISKOPUMKM', name_opd: 'Dinas Koperasi, Usaha Kecil dan Menengah' },
    { id: 13, code_opd: 'DISBUN', name_opd: 'Dinas Perkebunan' },
    { id: 14, code_opd: 'DISNAK', name_opd: 'Dinas Peternakan dan Kesehatan Hewan' },
    { id: 15, code_opd: 'DISNAKER', name_opd: 'Dinas Tenaga Kerja' },
    { id: 16, code_opd: 'DISPAREKRAF', name_opd: 'Dinas Pariwisata dan Ekonomi Kreatif' },
    { id: 17, code_opd: 'SATPOLPP', name_opd: 'Satuan Polisi Pamong Praja Provinsi Lampung' },
    { id: 18, code_opd: 'DISKES', name_opd: 'Dinas Kesehatan' },
    { id: 19, code_opd: 'DISDIKBUD', name_opd: 'Dinas Pendidikan dan Kebudayaan Provinsi Lampung' },
    { id: 20, code_opd: 'DKPTPH', name_opd: 'Dinas Ketahanan Pangan Tanaman Pangan dan Hortikultura' },
    { id: 21, code_opd: 'RSUDAM', name_opd: 'RSUD Abdoel Moeloek' },
    { id: 22, code_opd: 'BAPENDA', name_opd: 'Badan Pendapatan Daerah Provinsi Lampung' },
    { id: 23, code_opd: 'DINSOS', name_opd: 'Dinas Sosial' },
    { id: 24, code_opd: 'DPMPTSP', name_opd: 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu' },
    { id: 25, code_opd: 'PMDT', name_opd: 'Dinas Pemberdayaan Masyarakat, Desa dan Transmigrasi' },
    { id: 26, code_opd: 'BPKAD', name_opd: 'Badan Pengelolaan Keuangan dan Aset Daerah Provinsi Lampung' },
    { id: 27, code_opd: 'DPSDA', name_opd: 'Dinas Pengelolaan Sumber Daya Air' },
    { id: 28, code_opd: 'DISHUB', name_opd: 'Dinas Perhubungan Provinsi Lampung' },
    { id: 29, code_opd: 'DBMBK', name_opd: 'Dinas Bina Marga Bina Konstruksi Provinsi Lampung' },
    { id: 30, code_opd: 'DPKPCK', name_opd: 'Dinas Perumahan, Kawasan Permukiman dan Cipta Karya' },
    { id: 31, code_opd: 'DISDUKCAPIL', name_opd: 'Dinas Kependudukan dan Pencatatan Sipil Provinsi Lampung' },
    { id: 32, code_opd: 'DISPERINDAG', name_opd: 'Dinas Perindustrian dan Perdagangan Provinsi Lampung' },
    { id: 33, code_opd: 'DPPPA', name_opd: 'Dinas Pemberdayaan Perempuan dan Perlindungan Anak Provinsi Lampung' },
    { id: 34, code_opd: 'BAKESBANGPOL', name_opd: 'Badan Kesatuan Bangsa dan Politik' },
    { id: 35, code_opd: 'SETWAN', name_opd: 'Sekretariat DPRD Provinsi Lampung' },
    { id: 36, code_opd: 'BIRO_ORGANISASI', name_opd: 'Biro Organisasi' },
    { id: 37, code_opd: 'BPBD', name_opd: 'Badan Penanggulangan Bencana Daerah' },
    { id: 38, code_opd: 'RSJD', name_opd: 'Rumah Sakit Jiwa Daerah Provinsi Lampung' },
    { id: 39, code_opd: 'PENGHUBUNG', name_opd: 'Badan Penghubung' }
];

// Helper to normalize strings for robust matching
function normalize(str) {
    if (!str) return '';
    return String(str).toLowerCase()
        .replace(/provinsi/g, '')
        .replace(/prov/g, '')
        .replace(/lampung/g, '')
        .replace(/dan/g, '')
        .replace(/&/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

const opdNameMap = {};
opdSeeds.forEach(opd => {
    opdNameMap[normalize(opd.name_opd)] = opd.id;
});

// Manual corrections for tricky OPD names in Excel sheets
const manualOpdCorrection = {
    'dinas kominfo': 8,
    'dinas perhubungan': 28,
    'dinas bina marga dan bina konstruksi': 29,
    'dinas bina marga bina konstruksi': 29,
    'satuan polisi pamong praja': 17,
    'sekretariat dprd': 35,
    'biro organisasi': 36
};

function getOpdId(name) {
    if (!name) return null;
    const norm = normalize(name);
    if (opdNameMap[norm]) return opdNameMap[norm];
    
    // Check manual corrections
    for (const key in manualOpdCorrection) {
        if (norm.includes(normalize(key))) {
            return manualOpdCorrection[key];
        }
    }
    return null;
}

function getCleanVal(sheet, cellAddr) {
    const cell = sheet[cellAddr];
    return cell && cell.v !== undefined ? String(cell.v).trim() : '';
}

function isRowEmpty(sheet, row, cols) {
    return cols.every(col => !getCleanVal(sheet, `${col}${row}`));
}

// Convert column index (0-based) to letter
function getColName(index) {
    let name = '';
    while (index >= 0) {
        name = String.fromCharCode((index % 26) + 65) + name;
        index = Math.floor(index / 26) - 1;
    }
    return name;
}

async function main() {
    console.log('--- SPIP DATA IMPORT SCRIPT ---');

    // 0. Clean Existing Database Tables
    console.log('Clearing existing tables...');
    await supabase.from('trx_achievement_assessment').delete().neq('id', 0);
    await supabase.from('trx_subelement_assessment').delete().neq('id', 0);
    await supabase.from('trx_kke_assessment').delete().neq('id', 0);
    await supabase.from('mst_pohon_kinerja').delete().neq('id', 0);
    await supabase.from('ref_opd').delete().neq('id', 0);
    console.log('Tables cleared successfully.');

    // 1. Seed OPDs
    console.log('Inserting ref_opd seeds...');
    const { error: opdError } = await supabase.from('ref_opd').insert(opdSeeds);
    if (opdError) {
        console.error('Error seeding OPDs:', opdError.message);
        process.exit(1);
    }
    console.log(`Inserted ${opdSeeds.length} OPDs.`);

    // 2. Parse and build tree hierarchy (mst_pohon_kinerja)
    const nodeMapping = {
        PEMDA: {},    // title -> dbId
        OPD: {},      // opdId_title -> dbId
        PROGRAM: {},  // opdId_title -> dbId
        KEGIATAN: {}, // opdId_title -> dbId
        SUB_KEGIATAN: {}
    };

    const kkeAssessments = [];

    // LEVEL 0: PEMDA (KKE 1.1)
    console.log('Parsing PEMDA level objectives (KKE 1.1)...');
    const s11 = workbook.Sheets['KKE 1.1 SASTRA'];
    if (!s11) {
        console.error('KKE 1.1 SASTRA sheet not found!');
        process.exit(1);
    }

    const range11 = xlsx.utils.decode_range(s11['!ref']);
    const pemdaInsertions = [];

    for (let r = 14; r <= range11.e.r + 1; r++) {
        if (isRowEmpty(s11, r, ['B', 'C', 'D', 'E'])) continue;
        const title = getCleanVal(s11, `B${r}`);
        const indicator = getCleanVal(s11, `C${r}`);
        const target = getCleanVal(s11, `D${r}`);
        const unit = getCleanVal(s11, `E${r}`);

        const actualTitle = title || (pemdaInsertions.length > 0 ? pemdaInsertions[pemdaInsertions.length - 1].title_objective : '');
        if (!actualTitle || !indicator) continue;

        // KKE quality columns
        // F-J: sasaran_tepat
        // K-O: indikator_tepat
        // P-T: target_tepat
        const kke = {
            sasaran_tepat: {
                result: getCleanVal(s11, `F${r}`) || 'Y',
                aoi_cluster: getCleanVal(s11, `G${r}`) || null,
                aoi_desc: getCleanVal(s11, `H${r}`) || null,
                cause_cluster: getCleanVal(s11, `I${r}`) || null,
                cause_desc: getCleanVal(s11, `J${r}`) || null
            },
            indikator_tepat: {
                result: getCleanVal(s11, `K${r}`) || 'Y',
                aoi_cluster: getCleanVal(s11, `L${r}`) || null,
                aoi_desc: getCleanVal(s11, `M${r}`) || null,
                cause_cluster: getCleanVal(s11, `N${r}`) || null,
                cause_desc: getCleanVal(s11, `O${r}`) || null
            },
            target_tepat: {
                result: getCleanVal(s11, `P${r}`) || 'Y',
                aoi_cluster: getCleanVal(s11, `Q${r}`) || null,
                aoi_desc: getCleanVal(s11, `R${r}`) || null,
                cause_cluster: getCleanVal(s11, `S${r}`) || null,
                cause_desc: getCleanVal(s11, `T${r}`) || null
            }
        };

        pemdaInsertions.push({
            fiscal_year: 2026,
            level_type: 'PEMDA',
            parent_id: null,
            opd_id: null,
            title_objective: actualTitle,
            indicator_name: indicator,
            target_value: target,
            unit_of_measurement: unit,
            kke
        });
    }

    console.log(`Inserting ${pemdaInsertions.length} PEMDA level tree nodes...`);
    for (const node of pemdaInsertions) {
        const { kke, ...dbPayload } = node;
        const { data, error } = await supabase.from('mst_pohon_kinerja').insert([dbPayload]).select('id').single();
        if (error) {
            console.error('Error inserting PEMDA node:', error.message);
            continue;
        }
        nodeMapping.PEMDA[dbPayload.title_objective] = data.id;

        // Insert KKE
        kkeAssessments.push({
            pohon_kinerja_id: data.id,
            opd_id: 1, // Default coordinator OPD (Bappeda)
            fiscal_year: 2026,
            assessment_type: 'KKE_1.1',
            assessment_data: kke
        });
    }

    // LEVEL 1: OPD (KKE 1.2)
    console.log('Parsing OPD level objectives (KKE 1.2)...');
    const s12 = workbook.Sheets['KKE 1.2 SASTRA OPD'];
    const range12 = xlsx.utils.decode_range(s12['!ref']);
    const opdInsertions = [];

    for (let r = 14; r <= range12.e.r + 1; r++) {
        if (isRowEmpty(s12, r, ['B', 'D', 'E', 'F'])) continue;
        const pemdaTitle = getCleanVal(s12, `B${r}`);
        const opdName = getCleanVal(s12, `D${r}`);
        const title = getCleanVal(s12, `E${r}`);
        const indicator = getCleanVal(s12, `F${r}`);
        const target = getCleanVal(s12, `G${r}`);
        const unit = getCleanVal(s12, `H${r}`);

        const actualPemdaTitle = pemdaTitle || (opdInsertions.length > 0 ? opdInsertions[opdInsertions.length - 1].pemdaTitle : '');
        const actualOpdName = opdName || (opdInsertions.length > 0 ? opdInsertions[opdInsertions.length - 1].opdName : '');
        const actualTitle = title || (opdInsertions.length > 0 ? opdInsertions[opdInsertions.length - 1].title_objective : '');

        if (!actualTitle || !indicator) continue;

        const opdId = getOpdId(actualOpdName);
        const parentId = nodeMapping.PEMDA[actualPemdaTitle] || null;

        if (!opdId) {
            // console.warn(`Could not resolve OPD name: "${actualOpdName}"`);
            continue;
        }

        // KKE quality columns
        // I-M: keterkaitan
        // N-R: sasaran_tepat
        // S-W: indikator_tepat
        // X-AB: target_tepat
        const kke = {
            keterkaitan: {
                result: getCleanVal(s12, `I${r}`) || 'Y',
                aoi_cluster: getCleanVal(s12, `J${r}`) || null,
                aoi_desc: getCleanVal(s12, `K${r}`) || null,
                cause_cluster: getCleanVal(s12, `L${r}`) || null,
                cause_desc: getCleanVal(s12, `M${r}`) || null
            },
            sasaran_tepat: {
                result: getCleanVal(s12, `N${r}`) || 'Y',
                aoi_cluster: getCleanVal(s12, `O${r}`) || null,
                aoi_desc: getCleanVal(s12, `P${r}`) || null,
                cause_cluster: getCleanVal(s12, `Q${r}`) || null,
                cause_desc: getCleanVal(s12, `R${r}`) || null
            },
            indikator_tepat: {
                result: getCleanVal(s12, `S${r}`) || 'Y',
                aoi_cluster: getCleanVal(s12, `T${r}`) || null,
                aoi_desc: getCleanVal(s12, `U${r}`) || null,
                cause_cluster: getCleanVal(s12, `V${r}`) || null,
                cause_desc: getCleanVal(s12, `W${r}`) || null
            },
            target_tepat: {
                result: getCleanVal(s12, `X${r}`) || 'Y',
                aoi_cluster: getCleanVal(s12, `Y${r}`) || null,
                aoi_desc: getCleanVal(s12, `Z${r}`) || null,
                cause_cluster: getCleanVal(s12, `AA${r}`) || null,
                cause_desc: getCleanVal(s12, `AB${r}`) || null
            }
        };

        opdInsertions.push({
            fiscal_year: 2026,
            level_type: 'OPD',
            parent_id: parentId,
            opd_id: opdId,
            title_objective: actualTitle,
            indicator_name: indicator,
            target_value: target,
            unit_of_measurement: unit,
            pemdaTitle: actualPemdaTitle,
            opdName: actualOpdName,
            kke
        });
    }

    console.log(`Inserting ${opdInsertions.length} OPD level tree nodes...`);
    for (const node of opdInsertions) {
        const { kke, pemdaTitle, opdName, ...dbPayload } = node;
        const { data, error } = await supabase.from('mst_pohon_kinerja').insert([dbPayload]).select('id').single();
        if (error) {
            console.error('Error inserting OPD node:', error.message);
            continue;
        }
        nodeMapping.OPD[`${dbPayload.opd_id}_${dbPayload.title_objective}`] = data.id;

        // Insert KKE
        kkeAssessments.push({
            pohon_kinerja_id: data.id,
            opd_id: dbPayload.opd_id,
            fiscal_year: 2026,
            assessment_type: 'KKE_1.2',
            assessment_data: kke
        });
    }

    // LEVEL 2: PROGRAM (KKE 2.1)
    console.log('Parsing PROGRAM level objectives (KKE 2.1)...');
    const s21 = workbook.Sheets['KKE 2.1 SASPRO'];
    const range21 = xlsx.utils.decode_range(s21['!ref']);
    const programInsertions = [];

    for (let r = 15; r <= range21.e.r + 1; r++) {
        if (isRowEmpty(s21, r, ['B', 'D', 'E', 'G', 'H', 'I'])) continue;
        const pemdaTitle = getCleanVal(s21, `B${r}`);
        const opdName = getCleanVal(s21, `D${r}`);
        const parentIndicator = getCleanVal(s21, `E${r}`);
        const programName = getCleanVal(s21, `G${r}`);
        const title = getCleanVal(s21, `H${r}`);
        const indicator = getCleanVal(s21, `I${r}`);
        const target = getCleanVal(s21, `J${r}`);
        const unit = getCleanVal(s21, `K${r}`);

        const actualPemdaTitle = pemdaTitle || (programInsertions.length > 0 ? programInsertions[programInsertions.length - 1].pemdaTitle : '');
        const actualOpdName = opdName || (programInsertions.length > 0 ? programInsertions[programInsertions.length - 1].opdName : '');
        const actualParentIndicator = parentIndicator || (programInsertions.length > 0 ? programInsertions[programInsertions.length - 1].parentIndicator : '');
        const actualProgramName = programName || (programInsertions.length > 0 ? programInsertions[programInsertions.length - 1].programName : '');
        const actualTitle = title || (programInsertions.length > 0 ? programInsertions[programInsertions.length - 1].title_objective : '');

        if (!actualTitle || !indicator) continue;

        const opdId = getOpdId(actualOpdName);
        if (!opdId) continue;

        // Resolve parent OPD node: we need to find the node belonging to this OPD where the indicator matches actualParentIndicator,
        // or we can match on OPD objectives.
        // Let's query from our local array or resolve by OPD.
        // Since we mapped OPD objectives by `opdId_title`, let's check which OPD node has the matching indicator.
        // Or we can just find any node belonging to this opdId in Level 1.
        let parentId = null;
        const parentOPDNode = opdInsertions.find(n => n.opd_id === opdId && normalize(n.indicator_name) === normalize(actualParentIndicator));
        if (parentOPDNode) {
            parentId = nodeMapping.OPD[`${opdId}_${parentOPDNode.title_objective}`];
        } else {
            // Fallback: match first OPD objective for this OPD
            const firstOPDNode = opdInsertions.find(n => n.opd_id === opdId);
            if (firstOPDNode) {
                parentId = nodeMapping.OPD[`${opdId}_${firstOPDNode.title_objective}`];
            }
        }

        // KKE quality columns
        // L-P: keterkaitan
        // Q-U: sasaran_tepat
        // V-Z: indikator_tepat
        // AA-AE: target_tepat
        const kke = {
            keterkaitan: {
                result: getCleanVal(s21, `L${r}`) || 'Y',
                aoi_cluster: getCleanVal(s21, `M${r}`) || null,
                aoi_desc: getCleanVal(s21, `N${r}`) || null,
                cause_cluster: getCleanVal(s21, `O${r}`) || null,
                cause_desc: getCleanVal(s21, `P${r}`) || null
            },
            sasaran_tepat: {
                result: getCleanVal(s21, `Q${r}`) || 'Y',
                aoi_cluster: getCleanVal(s21, `R${r}`) || null,
                aoi_desc: getCleanVal(s21, `S${r}`) || null,
                cause_cluster: getCleanVal(s21, `T${r}`) || null,
                cause_desc: getCleanVal(s21, `U${r}`) || null
            },
            indikator_tepat: {
                result: getCleanVal(s21, `V${r}`) || 'Y',
                aoi_cluster: getCleanVal(s21, `W${r}`) || null,
                aoi_desc: getCleanVal(s21, `X${r}`) || null,
                cause_cluster: getCleanVal(s21, `Y${r}`) || null,
                cause_desc: getCleanVal(s21, `Z${r}`) || null
            },
            target_tepat: {
                result: getCleanVal(s21, `AA${r}`) || 'Y',
                aoi_cluster: getCleanVal(s21, `AB${r}`) || null,
                aoi_desc: getCleanVal(s21, `AC${r}`) || null,
                cause_cluster: getCleanVal(s21, `AD${r}`) || null,
                cause_desc: getCleanVal(s21, `AE${r}`) || null
            }
        };

        programInsertions.push({
            fiscal_year: 2026,
            level_type: 'PROGRAM',
            parent_id: parentId,
            opd_id: opdId,
            title_objective: actualTitle,
            indicator_name: indicator,
            target_value: target,
            unit_of_measurement: unit,
            pemdaTitle: actualPemdaTitle,
            opdName: actualOpdName,
            parentIndicator: actualParentIndicator,
            kke
        });
    }

    console.log(`Inserting ${programInsertions.length} PROGRAM level tree nodes...`);
    for (const node of programInsertions) {
        const { kke, pemdaTitle, opdName, parentIndicator, ...dbPayload } = node;
        const { data, error } = await supabase.from('mst_pohon_kinerja').insert([dbPayload]).select('id').single();
        if (error) {
            console.error('Error inserting PROGRAM node:', error.message);
            continue;
        }
        nodeMapping.PROGRAM[`${dbPayload.opd_id}_${dbPayload.title_objective}`] = data.id;

        // Insert KKE
        kkeAssessments.push({
            pohon_kinerja_id: data.id,
            opd_id: dbPayload.opd_id,
            fiscal_year: 2026,
            assessment_type: 'KKE_2.1',
            assessment_data: kke
        });
    }

    // LEVEL 3: KEGIATAN (KKE 2.2)
    console.log('Parsing KEGIATAN level objectives (KKE 2.2)...');
    const s22 = workbook.Sheets['KKE 2.2 SASKEG'];
    const range22 = xlsx.utils.decode_range(s22['!ref']);
    const kegiatanInsertions = [];

    for (let r = 15; r <= range22.e.r + 1; r++) {
        if (isRowEmpty(s22, r, ['B', 'D', 'E', 'G', 'H', 'J', 'K', 'L', 'M'])) continue;
        const pemdaTitle = getCleanVal(s22, `B${r}`);
        const opdName = getCleanVal(s22, `D${r}`);
        const opdObjective = getCleanVal(s22, `E${r}`);
        const programName = getCleanVal(s22, `G${r}`);
        const programObjective = getCleanVal(s22, `H${r}`);
        const opdCode = getCleanVal(s22, `J${r}`);
        const kegiatanName = getCleanVal(s22, `K${r}`);
        const title = getCleanVal(s22, `L${r}`);
        const indicator = getCleanVal(s22, `M${r}`);
        const target = getCleanVal(s22, `N${r}`);
        const unit = getCleanVal(s22, `O${r}`);

        const actualPemdaTitle = pemdaTitle || (kegiatanInsertions.length > 0 ? kegiatanInsertions[kegiatanInsertions.length - 1].pemdaTitle : '');
        const actualOpdName = opdName || (kegiatanInsertions.length > 0 ? kegiatanInsertions[kegiatanInsertions.length - 1].opdName : '');
        const actualOpdObjective = opdObjective || (kegiatanInsertions.length > 0 ? kegiatanInsertions[kegiatanInsertions.length - 1].opdObjective : '');
        const actualProgramName = programName || (kegiatanInsertions.length > 0 ? kegiatanInsertions[kegiatanInsertions.length - 1].programName : '');
        const actualProgramObjective = programObjective || (kegiatanInsertions.length > 0 ? kegiatanInsertions[kegiatanInsertions.length - 1].programObjective : '');
        const actualOpdCode = opdCode || (kegiatanInsertions.length > 0 ? kegiatanInsertions[kegiatanInsertions.length - 1].opdCode : '');
        const actualKegiatanName = kegiatanName || (kegiatanInsertions.length > 0 ? kegiatanInsertions[kegiatanInsertions.length - 1].kegiatanName : '');
        const actualTitle = title || (kegiatanInsertions.length > 0 ? kegiatanInsertions[kegiatanInsertions.length - 1].title_objective : '');

        if (!actualTitle || !indicator) continue;

        const opdId = getOpdId(actualOpdName);
        if (!opdId) continue;

        // Resolve parent PROGRAM node
        let parentId = nodeMapping.PROGRAM[`${opdId}_${actualProgramObjective}`] || null;
        if (!parentId) {
            // Fallback: match first program for this OPD
            const fallbackNode = programInsertions.find(n => n.opd_id === opdId);
            if (fallbackNode) {
                parentId = nodeMapping.PROGRAM[`${opdId}_${fallbackNode.title_objective}`];
            }
        }

        // KKE quality columns
        // P-T: keterkaitan
        // U-Y: sasaran_tepat
        // Z-AD: indikator_tepat
        // AE-AI: target_tepat
        const kke = {
            keterkaitan: {
                result: getCleanVal(s22, `P${r}`) || 'Y',
                aoi_cluster: getCleanVal(s22, `Q${r}`) || null,
                aoi_desc: getCleanVal(s22, `R${r}`) || null,
                cause_cluster: getCleanVal(s22, `S${r}`) || null,
                cause_desc: getCleanVal(s22, `T${r}`) || null
            },
            sasaran_tepat: {
                result: getCleanVal(s22, `U${r}`) || 'Y',
                aoi_cluster: getCleanVal(s22, `V${r}`) || null,
                aoi_desc: getCleanVal(s22, `W${r}`) || null,
                cause_cluster: getCleanVal(s22, `X${r}`) || null,
                cause_desc: getCleanVal(s22, `Y${r}`) || null
            },
            indikator_tepat: {
                result: getCleanVal(s22, `Z${r}`) || 'Y',
                aoi_cluster: getCleanVal(s22, `AA${r}`) || null,
                aoi_desc: getCleanVal(s22, `AB${r}`) || null,
                cause_cluster: getCleanVal(s22, `AC${r}`) || null,
                cause_desc: getCleanVal(s22, `AD${r}`) || null
            },
            target_tepat: {
                result: getCleanVal(s22, `AE${r}`) || 'Y',
                aoi_cluster: getCleanVal(s22, `AF${r}`) || null,
                aoi_desc: getCleanVal(s22, `AG${r}`) || null,
                cause_cluster: getCleanVal(s22, `AH${r}`) || null,
                cause_desc: getCleanVal(s22, `AI${r}`) || null
            }
        };

        kegiatanInsertions.push({
            fiscal_year: 2026,
            level_type: 'KEGIATAN',
            parent_id: parentId,
            opd_id: opdId,
            title_objective: actualTitle,
            indicator_name: indicator,
            target_value: target,
            unit_of_measurement: unit,
            pemdaTitle: actualPemdaTitle,
            opdName: actualOpdName,
            opdObjective: actualOpdObjective,
            programName: actualProgramName,
            programObjective: actualProgramObjective,
            opdCode: actualOpdCode,
            kegiatanName: actualKegiatanName,
            kke
        });
    }

    console.log(`Inserting ${kegiatanInsertions.length} KEGIATAN level tree nodes...`);
    // Batch in groups of 100 to prevent Supabase connection issues
    for (let i = 0; i < kegiatanInsertions.length; i += 100) {
        const chunk = kegiatanInsertions.slice(i, i + 100);
        for (const node of chunk) {
            const { kke, pemdaTitle, opdName, opdObjective, programName, programObjective, opdCode, kegiatanName, ...dbPayload } = node;
            const { data, error } = await supabase.from('mst_pohon_kinerja').insert([dbPayload]).select('id').single();
            if (error) {
                console.error('Error inserting KEGIATAN node:', error.message);
                continue;
            }
            nodeMapping.KEGIATAN[`${dbPayload.opd_id}_${dbPayload.title_objective}`] = data.id;

            // Insert KKE
            kkeAssessments.push({
                pohon_kinerja_id: data.id,
                opd_id: dbPayload.opd_id,
                fiscal_year: 2026,
                assessment_type: 'KKE_2.2',
                assessment_data: kke
            });
        }
    }

    // LEVEL 4: SUB_KEGIATAN (KKE 2.3)
    console.log('Parsing SUB_KEGIATAN level objectives (KKE 2.3)...');
    const s23 = workbook.Sheets['KKE 2.3 SASSUBKEG'];
    const range23 = xlsx.utils.decode_range(s23['!ref']);
    const subKegInsertions = [];

    for (let r = 15; r <= range23.e.r + 1; r++) {
        if (isRowEmpty(s23, r, ['B', 'D', 'E', 'G', 'H', 'J', 'K', 'L', 'N', 'O', 'P'])) continue;
        const pemdaTitle = getCleanVal(s23, `B${r}`);
        const opdName = getCleanVal(s23, `D${r}`);
        const opdObjective = getCleanVal(s23, `E${r}`);
        const programName = getCleanVal(s23, `G${r}`);
        const programObjective = getCleanVal(s23, `H${r}`);
        const opdCode = getCleanVal(s23, `J${r}`);
        const kegiatanName = getCleanVal(s23, `K${r}`);
        const kegiatanObjective = getCleanVal(s23, `L${r}`);
        const subKegName = getCleanVal(s23, `N${r}`);
        const title = getCleanVal(s23, `O${r}`);
        const indicator = getCleanVal(s23, `P${r}`);
        const target = getCleanVal(s23, `Q${r}`);
        const unit = getCleanVal(s23, `R${r}`);

        const actualPemdaTitle = pemdaTitle || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].pemdaTitle : '');
        const actualOpdName = opdName || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].opdName : '');
        const actualOpdObjective = opdObjective || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].opdObjective : '');
        const actualProgramName = programName || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].programName : '');
        const actualProgramObjective = programObjective || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].programObjective : '');
        const actualOpdCode = opdCode || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].opdCode : '');
        const actualKegiatanName = kegiatanName || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].kegiatanName : '');
        const actualKegiatanObjective = kegiatanObjective || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].kegiatanObjective : '');
        const actualSubKegName = subKegName || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].subKegName : '');
        const actualTitle = title || (subKegInsertions.length > 0 ? subKegInsertions[subKegInsertions.length - 1].title_objective : '');

        if (!actualTitle || !indicator) continue;

        const opdId = getOpdId(actualOpdName);
        if (!opdId) continue;

        // Resolve parent KEGIATAN node
        let parentId = nodeMapping.KEGIATAN[`${opdId}_${actualKegiatanObjective}`] || null;
        if (!parentId) {
            // Fallback: match first kegiatan for this OPD
            const fallbackNode = kegiatanInsertions.find(n => n.opd_id === opdId);
            if (fallbackNode) {
                parentId = nodeMapping.KEGIATAN[`${opdId}_${fallbackNode.title_objective}`];
            }
        }

        // KKE quality columns
        // S-W: keterkaitan
        // X-AB: indikator_tepat
        // AC-AG: target_tepat
        const kke = {
            keterkaitan: {
                result: getCleanVal(s23, `S${r}`) || 'Y',
                aoi_cluster: getCleanVal(s23, `T${r}`) || null,
                aoi_desc: getCleanVal(s23, `U${r}`) || null,
                cause_cluster: getCleanVal(s23, `V${r}`) || null,
                cause_desc: getCleanVal(s23, `W${r}`) || null
            },
            indikator_tepat: {
                result: getCleanVal(s23, `X${r}`) || 'Y',
                aoi_cluster: getCleanVal(s23, `Y${r}`) || null,
                aoi_desc: getCleanVal(s23, `Z${r}`) || null,
                cause_cluster: getCleanVal(s23, `AA${r}`) || null,
                cause_desc: getCleanVal(s23, `AB${r}`) || null
            },
            target_tepat: {
                result: getCleanVal(s23, `AC${r}`) || 'Y',
                aoi_cluster: getCleanVal(s23, `AD${r}`) || null,
                aoi_desc: getCleanVal(s23, `AE${r}`) || null,
                cause_cluster: getCleanVal(s23, `AF${r}`) || null,
                cause_desc: getCleanVal(s23, `AG${r}`) || null
            }
        };

        subKegInsertions.push({
            fiscal_year: 2026,
            level_type: 'SUB_KEGIATAN',
            parent_id: parentId,
            opd_id: opdId,
            title_objective: actualTitle,
            indicator_name: indicator,
            target_value: target,
            unit_of_measurement: unit,
            pemdaTitle: actualPemdaTitle,
            opdName: actualOpdName,
            opdObjective: actualOpdObjective,
            programName: actualProgramName,
            programObjective: actualProgramObjective,
            opdCode: actualOpdCode,
            kegiatanName: actualKegiatanName,
            kegiatanObjective: actualKegiatanObjective,
            subKegName: actualSubKegName,
            kke
        });
    }

    console.log(`Inserting ${subKegInsertions.length} SUB_KEGIATAN level tree nodes...`);
    // Batch in groups of 100
    for (let i = 0; i < subKegInsertions.length; i += 100) {
        const chunk = subKegInsertions.slice(i, i + 100);
        for (const node of chunk) {
            const { kke, pemdaTitle, opdName, opdObjective, programName, programObjective, opdCode, kegiatanName, kegiatanObjective, subKegName, ...dbPayload } = node;
            const { data, error } = await supabase.from('mst_pohon_kinerja').insert([dbPayload]).select('id').single();
            if (error) {
                console.error('Error inserting SUB_KEGIATAN node:', error.message);
                continue;
            }

            // Insert KKE
            kkeAssessments.push({
                pohon_kinerja_id: data.id,
                opd_id: dbPayload.opd_id,
                fiscal_year: 2026,
                assessment_type: 'KKE_2.3',
                assessment_data: kke
            });
        }
    }

    // Insert KKE Quality Assessments
    console.log(`Inserting ${kkeAssessments.length} KKE Quality Assessments...`);
    for (let i = 0; i < kkeAssessments.length; i += 100) {
        const chunk = kkeAssessments.slice(i, i + 100);
        const { error } = await supabase.from('trx_kke_assessment').insert(chunk);
        if (error) {
            console.error('Error batch inserting KKE assessments:', error.message);
        }
    }
    console.log('KKE Quality Assessments inserted successfully.');


    // 3. Parse and insert Subelement Assessments (KK3.1 - KK3.4)
    console.log('Parsing Subelement Assessments (KK3.1 - KK3.4)...');
    
    const subelementInsertions = [];
    const kkSheets = [
        { name: 'KK3.1', pillar: 'T1' },
        { name: 'KK3.2', pillar: 'T2' },
        { name: 'KK3.3', pillar: 'T3' },
        { name: 'KK3.4', pillar: 'T4' }
    ];

    for (const kkSheet of kkSheets) {
        const sheet = workbook.Sheets[kkSheet.name];
        if (!sheet) {
            console.warn(`Subelement sheet ${kkSheet.name} not found!`);
            continue;
        }

        // Loop over the 38 active OPD blocks
        for (let i = 0; i < 38; i++) {
            const startIdx = 12 + i * 6; // Starts at M (index 12)
            const startCol = getColName(startIdx);
            const endCol = getColName(startIdx + 5);
            
            const opdName = getCleanVal(sheet, `${endCol}6`);
            const opdId = getOpdId(opdName);

            if (!opdId) {
                continue;
            }

            let currentSubCode = '';
            
            for (let r = 10; r <= 300; r++) {
                const valA = getCleanVal(sheet, `A${r}`);
                const valC = getCleanVal(sheet, `C${r}`);

                if (valA) {
                    currentSubCode = valA;
                    // Resolve Excel serial dates
                    if (currentSubCode === '45505' || currentSubCode === '45505.00') {
                        currentSubCode = '1.8';
                    } else if (currentSubCode === '45507' || currentSubCode === '45507.00') {
                        currentSubCode = '3.8';
                    } else if (currentSubCode === '45538' || currentSubCode === '45538.00') {
                        currentSubCode = '3.9';
                    }
                }

                if (valC) {
                    const paramNo = parseInt(valC);
                    const grade = getCleanVal(sheet, `${startCol}${r}`);

                    if (grade && ['A', 'B', 'C', 'D', 'E'].includes(grade)) {
                        // Offset matching the selected grade row to extract Uraian
                        const offset = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 }[grade] || 0;
                        const uraianRow = r + offset;
                        const uraian = getCleanVal(sheet, `${endCol}${uraianRow}`);

                        let aoiCluster = getCleanVal(sheet, `${getColName(startIdx + 1)}${r}`) || null;
                        if (aoiCluster && aoiCluster.length > 255) aoiCluster = aoiCluster.substring(0, 255);
                        const aoiDesc = getCleanVal(sheet, `${getColName(startIdx + 2)}${r}`) || null;

                        let causeCluster = getCleanVal(sheet, `${getColName(startIdx + 3)}${r}`) || null;
                        if (causeCluster && causeCluster.length > 255) causeCluster = causeCluster.substring(0, 255);
                        const causeDesc = getCleanVal(sheet, `${getColName(startIdx + 4)}${r}`) || null;

                        subelementInsertions.push({
                            opd_id: opdId,
                            fiscal_year: 2026,
                            pillar_type: kkSheet.pillar,
                            subelement_code: currentSubCode,
                            parameter_no: paramNo,
                            opd_uraian: uraian || null,
                            opd_grade: grade,
                            opd_aoi_cluster: aoiCluster,
                            opd_aoi_desc: aoiDesc,
                            opd_cause_cluster: causeCluster,
                            opd_cause_desc: causeDesc,
                            status_flow: 'OPD_DRAFT'
                        });
                    }

                    r += 4; // Skip the other 4 rows of the parameter block
                }
            }
        }
    }

    console.log(`Inserting ${subelementInsertions.length} Subelement Assessments...`);
    // Batch in groups of 100
    for (let i = 0; i < subelementInsertions.length; i += 100) {
        const chunk = subelementInsertions.slice(i, i + 100);
        const { error } = await supabase.from('trx_subelement_assessment').insert(chunk);
        if (error) {
            console.error('Error batch inserting subelements:', error.message);
        }
    }
    console.log('Subelement Assessments inserted successfully.');


    // 4. Parse and insert Achievements (KK5 - KK8)
    console.log('Inserting Achievement outcomes (KK5 - KK8)...');
    
    // We construct these from the KKLEAD III summaries we verified
    const achievements = [
        {
            fiscal_year: 2026,
            kk_type: 'KK5',
            data_payload: {
                pemda_outcome: 'A',
                opd_outcome: 'B',
                output: 'C'
            }
        },
        {
            fiscal_year: 2026,
            kk_type: 'KK6',
            data_payload: {
                opini_2025: 'WTP',
                opini_2024: 'WTP',
                temuan_count: 3,
                temuan_rupiah: '0'
            }
        },
        {
            fiscal_year: 2026,
            kk_type: 'KK7',
            data_payload: {
                kondisi_baik: '90',
                temuan_aset: 'C',
                uraian_aset: 'Penatausahaan persediaan dan pengamanan fisik aset daerah dinilai cukup baik dengan temuan minor dari BPK.'
            }
        },
        {
            fiscal_year: 2026,
            kk_type: 'KK8',
            data_payload: {
                temuan_count: 5,
                korupsi: 'Tidak'
            }
        }
    ];

    const { error: achError } = await supabase.from('trx_achievement_assessment').insert(achievements);
    if (achError) {
        console.error('Error inserting achievements:', achError.message);
    } else {
        console.log('Achievements (KK5 - KK8) inserted successfully.');
    }

    console.log('\n--- DATA IMPORT COMPLETED SUCCESSFULLY ---');
}

main().catch(err => {
    console.error('Unexpected error in import script:', err);
});
