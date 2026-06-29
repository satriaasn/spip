const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const anonKeyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
const anonKey = anonKeyMatch ? anonKeyMatch[1].trim().replace(/['"]/g, '') : '';
const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.+)/);
const supabaseUrl = urlMatch ? urlMatch[1].trim().replace(/['"]/g, '') : 'https://mngsigaowhlimqhrbwva.supabase.co';

const supabase = createClient(supabaseUrl, anonKey);

async function checkKke() {
    const { data, error } = await supabase
        .from('trx_kke_assessment')
        .select('*, mst_pohon_kinerja(title_objective, level_type)')
        .eq('assessment_type', 'KKE_1.2')
        .limit(3);
    
    if (error) {
        console.error('Error fetching:', error);
        return;
    }
    
    console.log(JSON.stringify(data, null, 2));
}

checkKke();
