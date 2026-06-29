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
    const { data, error } = await supabase
        .from('mst_pohon_kinerja')
        .select('level_type');
    
    if (error) {
        console.error('Error fetching:', error);
        return;
    }
    
    const counts = {};
    data.forEach(d => {
        counts[d.level_type] = (counts[d.level_type] || 0) + 1;
    });
    console.log('Total level_type counts:', counts);
}

checkPohon();
