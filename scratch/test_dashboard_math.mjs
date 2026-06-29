import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
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

async function testMath() {
    console.log('Loading database records...');
    const { data: kke } = await supabase.from('trx_kke_assessment').select('*, mst_pohon_kinerja(*)');
    const { data: sub } = await supabase.from('trx_subelement_assessment').select('*');
    const { data: ach } = await supabase.from('trx_achievement_assessment').select('*');

    console.log(`Loaded ${kke?.length || 0} KKE, ${sub?.length || 0} Subelements, ${ach?.length || 0} Achievements.`);

    // 1. Calculate KKE Ratios
    // KKE 1.1: level_type = PEMDA
    const k11 = kke.filter(k => k.assessment_type === 'KKE_1.1');
    const k11_sasaran_y = k11.filter(k => k.assessment_data?.sasaran_tepat?.result === 'Y').length;
    const k11_sasaran_total = k11.filter(k => k.assessment_data?.sasaran_tepat?.result).length;
    const k11_ind_y = k11.filter(k => k.assessment_data?.indikator_tepat?.result === 'Y').length;
    const k11_ind_total = k11.filter(k => k.assessment_data?.indikator_tepat?.result).length;
    const k11_tar_y = k11.filter(k => k.assessment_data?.target_tepat?.result === 'Y').length;
    const k11_tar_total = k11.filter(k => k.assessment_data?.target_tepat?.result).length;

    console.log(`KKE 1.1: Sasaran=${k11_sasaran_y}/${k11_sasaran_total}, Indikator=${k11_ind_y}/${k11_ind_total}, Target=${k11_tar_y}/${k11_tar_total}`);

    // KKE 1.2: level_type = OPD
    const k12 = kke.filter(k => k.assessment_type === 'KKE_1.2');
    const k12_ket_y = k12.filter(k => k.assessment_data?.keterkaitan?.result === 'Y').length;
    const k12_ket_total = k12.filter(k => k.assessment_data?.keterkaitan?.result).length;
    const k12_sas_y = k12.filter(k => k.assessment_data?.sasaran_tepat?.result === 'Y').length;
    const k12_sas_total = k12.filter(k => k.assessment_data?.sasaran_tepat?.result).length;
    const k12_ind_y = k12.filter(k => k.assessment_data?.indikator_tepat?.result === 'Y').length;
    const k12_ind_total = k12.filter(k => k.assessment_data?.indikator_tepat?.result).length;
    const k12_tar_y = k12.filter(k => k.assessment_data?.target_tepat?.result === 'Y').length;
    const k12_tar_total = k12.filter(k => k.assessment_data?.target_tepat?.result).length;

    console.log(`KKE 1.2: Keterkaitan=${k12_ket_y}/${k12_ket_total}, Sasaran=${k12_sas_y}/${k12_sas_total}, Indikator=${k12_ind_y}/${k12_ind_total}, Target=${k12_tar_y}/${k12_tar_total}`);
}

testMath();
