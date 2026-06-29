import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.join(__dirname, '../.env');
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

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
console.log('Loading workbook from:', excelPath);
const workbook = xlsx.readFile(excelPath);

function getCleanVal(sheet, cellAddr) {
    const cell = sheet[cellAddr];
    return cell && cell.v !== undefined ? String(cell.v).trim() : '';
}

async function run() {
    console.log('--- STARTING DETAILED ACHIEVEMENTS IMPORT (KK5 - KK8) ---');

    // 1. KK 5.1 A (Capaian Sasaran Pemda)
    const s51a = workbook.Sheets['KK 5.1 A'];
    const rows51a = [];
    if (s51a) {
        const range = xlsx.utils.decode_range(s51a['!ref']);
        for (let r = 10; r <= range.e.r; r++) {
            const no = getCleanVal(s51a, `A${r + 1}`);
            const sasaran = getCleanVal(s51a, `B${r + 1}`);
            const indikator = getCleanVal(s51a, `C${r + 1}`);
            const sasaranTepat = getCleanVal(s51a, `D${r + 1}`);
            const ikTepat = getCleanVal(s51a, `E${r + 1}`);
            const dataAndal = getCleanVal(s51a, `F${r + 1}`);
            const pm = getCleanVal(s51a, `G${r + 1}`);
            const target = getCleanVal(s51a, `I${r + 1}`);
            const realisasi = getCleanVal(s51a, `J${r + 1}`);
            const persentase = getCleanVal(s51a, `L${r + 1}`);
            const nilai = getCleanVal(s51a, `M${r + 1}`);

            if (indikator && target) {
                rows51a.push({
                    no: no || String(rows51a.length + 1),
                    sasaran,
                    indikator,
                    sasaranTepat,
                    ikTepat,
                    dataAndal,
                    pm,
                    target,
                    realisasi,
                    persentase,
                    nilai
                });
            }
        }
    }
    console.log(`Parsed ${rows51a.length} rows for KK5.1A`);

    // 2. KK 5.1 B (Capaian Sasaran OPD)
    const s51b = workbook.Sheets['KK 5.1 B '];
    const rows51b = [];
    if (s51b) {
        const range = xlsx.utils.decode_range(s51b['!ref']);
        for (let r = 10; r <= range.e.r; r++) {
            const no = getCleanVal(s51b, `A${r + 1}`);
            const sasaranPemda = getCleanVal(s51b, `B${r + 1}`);
            const opdName = getCleanVal(s51b, `E${r + 1}`);
            const sasaranOpd = getCleanVal(s51b, `F${r + 1}`);
            const indikatorOpd = getCleanVal(s51b, `G${r + 1}`);
            const target = getCleanVal(s51b, `I${r + 1}`);
            const realisasi = getCleanVal(s51b, `J${r + 1}`);
            const relevan = getCleanVal(s51b, `H${r + 1}`);
            const sasaranTepat = getCleanVal(s51b, `I${r + 1}`); // Excel column letters offset
            const ikTepat = getCleanVal(s51b, `J${r + 1}`);
            const dataAndal = getCleanVal(s51b, `K${r + 1}`);
            const pm = getCleanVal(s51b, `L${r + 1}`);

            if (indikatorOpd) {
                rows51b.push({
                    no: no || String(rows51b.length + 1),
                    sasaranPemda,
                    opdName,
                    sasaranOpd,
                    indikatorOpd,
                    target,
                    realisasi,
                    relevan,
                    sasaranTepat,
                    ikTepat,
                    dataAndal,
                    pm
                });
            }
        }
    }
    console.log(`Parsed ${rows51b.length} rows for KK5.1B`);

    // 3. KK 5.2 (Capaian Output)
    const s52 = workbook.Sheets['KK 5.2'];
    const rows52 = [];
    if (s52) {
        const range = xlsx.utils.decode_range(s52['!ref']);
        for (let r = 10; r <= range.e.r; r++) {
            const no = getCleanVal(s52, `A${r + 1}`);
            const sasaranPemda = getCleanVal(s52, `B${r + 1}`);
            const opdName = getCleanVal(s52, `E${r + 1}`);
            const sasaranOpd = getCleanVal(s52, `F${r + 1}`);
            const sasaranProgram = getCleanVal(s52, `I${r + 1}`);
            const programName = getCleanVal(s52, `L${r + 1}`);
            const outputName = getCleanVal(s52, `M${r + 1}`);

            if (outputName) {
                rows52.push({
                    no: no || String(rows52.length + 1),
                    sasaranPemda,
                    opdName,
                    sasaranOpd,
                    sasaranProgram,
                    programName,
                    outputName
                });
            }
        }
    }
    console.log(`Parsed ${rows52.length} rows for KK5.2`);

    // 4. KK 6 (Opini & Temuan LK BPK)
    const s6 = workbook.Sheets['KK 6'];
    const rows6 = [];
    if (s6) {
        const range = xlsx.utils.decode_range(s6['!ref']);
        for (let r = 7; r <= range.e.r; r++) {
            const no = getCleanVal(s6, `A${r + 1}`);
            const opini2025 = getCleanVal(s6, `B${r + 1}`);
            const klasifikasi2025 = getCleanVal(s6, `C${r + 1}`);
            const uraian2025 = getCleanVal(s6, `D${r + 1}`);
            const nilai2025 = getCleanVal(s6, `E${r + 1}`);
            const penyebab2025 = getCleanVal(s6, `F${r + 1}`);
            const subunsur2025 = getCleanVal(s6, `G${r + 1}`);

            const opini2024 = getCleanVal(s6, `H${r + 1}`);
            const klasifikasi2024 = getCleanVal(s6, `I${r + 1}`);
            const uraian2024 = getCleanVal(s6, `J${r + 1}`);
            const nilai2024 = getCleanVal(s6, `K${r + 1}`);
            const penyebab2024 = getCleanVal(s6, `L${r + 1}`);
            const subunsur2024 = getCleanVal(s6, `M${r + 1}`);

            if (klasifikasi2024 || uraian2024 || klasifikasi2025 || uraian2025) {
                rows6.push({
                    no: no || String(rows6.length + 1),
                    opini2025,
                    klasifikasi2025,
                    uraian2025,
                    nilai2025,
                    penyebab2025,
                    subunsur2025,
                    opini2024,
                    klasifikasi2024,
                    uraian2024,
                    nilai2024,
                    penyebab2024,
                    subunsur2024
                });
            }
        }
    }
    console.log(`Parsed ${rows6.length} rows for KK6`);

    // 5. KK 7 (Pengamanan Aset)
    const s7 = workbook.Sheets['KK 7'];
    const rows7 = [];
    if (s7) {
        const range = xlsx.utils.decode_range(s7['!ref']);
        for (let r = 8; r <= range.e.r; r++) {
            const no = getCleanVal(s7, `A${r + 1}`);
            const opini2025 = getCleanVal(s7, `B${r + 1}`);
            const kondisiBaik2025 = getCleanVal(s7, `C${r + 1}`);
            const klasifikasi2025 = getCleanVal(s7, `D${r + 1}`);
            const uraian2025 = getCleanVal(s7, `E${r + 1}`);
            const nilai2025 = getCleanVal(s7, `F${r + 1}`);
            const penyebab2025 = getCleanVal(s7, `G${r + 1}`);
            const subunsur2025 = getCleanVal(s7, `H${r + 1}`);

            const opini2024 = getCleanVal(s7, `I${r + 1}`);
            const kondisiBaik2024 = getCleanVal(s7, `J${r + 1}`);
            const klasifikasi2024 = getCleanVal(s7, `K${r + 1}`);
            const uraian2024 = getCleanVal(s7, `L${r + 1}`);
            const nilai2024 = getCleanVal(s7, `M${r + 1}`);

            if (klasifikasi2024 || uraian2024 || klasifikasi2025 || uraian2025) {
                rows7.push({
                    no: no || String(rows7.length + 1),
                    opini2025,
                    kondisiBaik2025,
                    klasifikasi2025,
                    uraian2025,
                    nilai2025,
                    penyebab2025,
                    subunsur2025,
                    opini2024,
                    kondisiBaik2024,
                    klasifikasi2024,
                    uraian2024,
                    nilai2024
                });
            }
        }
    }
    console.log(`Parsed ${rows7.length} rows for KK7`);

    // 6. KK 8 (Ketaatan & Korupsi)
    const s8 = workbook.Sheets['KK 8'];
    const rows8 = [];
    if (s8) {
        const range = xlsx.utils.decode_range(s8['!ref']);
        for (let r = 7; r <= range.e.r; r++) {
            const no = getCleanVal(s8, `A${r + 1}`);
            const opini2025 = getCleanVal(s8, `B${r + 1}`);
            const klasifikasi2025 = getCleanVal(s8, `C${r + 1}`);
            const uraian2025 = getCleanVal(s8, `D${r + 1}`);
            const nilai2025 = getCleanVal(s8, `E${r + 1}`);
            const penyebab2025 = getCleanVal(s8, `F${r + 1}`);
            const subunsur2025 = getCleanVal(s8, `G${r + 1}`);

            const opini2024 = getCleanVal(s8, `H${r + 1}`);
            const klasifikasi2024 = getCleanVal(s8, `I${r + 1}`);
            const uraian2024 = getCleanVal(s8, `J${r + 1}`);
            const nilai2024 = getCleanVal(s8, `K${r + 1}`);
            const penyebab2024 = getCleanVal(s8, `L${r + 1}`);
            const subunsur2024 = getCleanVal(s8, `M${r + 1}`);

            if (klasifikasi2024 || uraian2024 || klasifikasi2025 || uraian2025) {
                rows8.push({
                    no: no || String(rows8.length + 1),
                    opini2025,
                    klasifikasi2025,
                    uraian2025,
                    nilai2025,
                    penyebab2025,
                    subunsur2025,
                    opini2024,
                    klasifikasi2024,
                    uraian2024,
                    nilai2024,
                    penyebab2024,
                    subunsur2024
                });
            }
        }
    }
    console.log(`Parsed ${rows8.length} rows for KK8`);

    // Clean current table
    console.log('Cleaning old achievements records...');
    await supabase.from('trx_achievement_assessment').delete().neq('id', 0);

    // Save with rows array and summary object
    const inserts = [
        {
            fiscal_year: 2026,
            kk_type: 'KK5.1A',
            data_payload: {
                rows: rows51a,
                summary: { pemda_outcome: 'B' }
            }
        },
        {
            fiscal_year: 2026,
            kk_type: 'KK5.1B',
            data_payload: {
                rows: rows51b,
                summary: { opd_outcome: 'B' }
            }
        },
        {
            fiscal_year: 2026,
            kk_type: 'KK5.2',
            data_payload: {
                rows: rows52,
                summary: { output: 'C' }
            }
        },
        {
            fiscal_year: 2026,
            kk_type: 'KK6',
            data_payload: {
                rows: rows6,
                summary: { opini_2025: 'WTP', opini_2024: 'WTP', temuan_count: 5, temuan_rupiah: '9243014000' }
            }
        },
        {
            fiscal_year: 2026,
            kk_type: 'KK7',
            data_payload: {
                rows: rows7,
                summary: { kondisi_baik: '98', temuan_aset: 'C', uraian_aset: 'Aset dikuasai pihak lain berupa tanah belum optimal.' }
            }
        },
        {
            fiscal_year: 2026,
            kk_type: 'KK8',
            data_payload: {
                rows: rows8,
                summary: { temuan_count: 14, korupsi: 'Tidak' }
            }
        }
    ];

    console.log('Inserting detailed achievements to DB...');
    const { error } = await supabase.from('trx_achievement_assessment').insert(inserts);
    if (error) {
        console.error('Error inserting detailed achievements:', error.message);
    } else {
        console.log('Detailed achievements seeded successfully!');
    }
}

run();
