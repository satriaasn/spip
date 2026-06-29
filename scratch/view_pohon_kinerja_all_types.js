const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const anonKeyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
const anonKey = anonKeyMatch ? anonKeyMatch[1].trim().replace(/['"]/g, '') : '';
const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.+)/);
const supabaseUrl = urlMatch ? urlMatch[1].trim().replace(/['"]/g, '') : 'https://mngsigaowhlimqhrbwva.supabase.co';

const supabase = createClient(supabaseUrl, anonKey);

async function checkPohon() {
    const { data: pemda, error: err1 } = await supabase
        .from('mst_pohon_kinerja')
        .select('*')
        .eq('level_type', 'PEMDA');
        
    const { data: opd, error: err2 } = await supabase
        .from('mst_pohon_kinerja')
        .select('*')
        .eq('level_type', 'OPD');
        
    console.log('PEMDA count:', pemda ? pemda.length : 0);
    console.log('OPD count:', opd ? opd.length : 0);
    if (opd && opd.length > 0) {
        console.log('Sample OPD node:', opd[0]);
    }
}

checkPohon();
