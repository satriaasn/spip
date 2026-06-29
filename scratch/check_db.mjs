import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mngsigaowhlimqhrbwva.supabase.co';
const supabaseAnonKey = 'sb_publishable_ehItH8QD0UVw5uSFQURWpQ_3qN5dBYu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    const opds = await supabase.from('ref_opd').select('count', { count: 'exact' });
    const profiles = await supabase.from('profiles').select('count', { count: 'exact' });
    const pk = await supabase.from('mst_pohon_kinerja').select('count', { count: 'exact' });
    const kke = await supabase.from('trx_kke_assessment').select('count', { count: 'exact' });
    const sub = await supabase.from('trx_subelement_assessment').select('count', { count: 'exact' });
    const ach = await supabase.from('trx_achievement_assessment').select('count', { count: 'exact' });

    console.log('Database Row Counts:');
    console.log('- ref_opd:', opds.count);
    console.log('- profiles:', profiles.count);
    console.log('- mst_pohon_kinerja:', pk.count);
    console.log('- trx_kke_assessment:', kke.count);
    console.log('- trx_subelement_assessment:', sub.count);
    console.log('- trx_achievement_assessment:', ach.count);

  } catch (err) {
    console.error('Error querying Supabase:', err);
  }
}

run();
