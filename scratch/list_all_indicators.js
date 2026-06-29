const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const targetSheets = ['KK 5.1 A', 'KK 5.1 B ', 'KK 5.1 C', 'KK 5.2', 'KK 6', 'KK 7', 'KK 8'];

targetSheets.forEach(name => {
    const s = workbook.Sheets[name];
    if (!s) return;
    const range = xlsx.utils.decode_range(s['!ref']);
    let count = 0;
    for (let r = 8; r <= range.e.r; r++) {
        const ind = s[`C${r + 1}`] ? String(s[`C${r + 1}`].v).trim() : '';
        if (ind && ind !== '3' && ind !== 'Klasifikasi Temuan') {
            count++;
        }
    }
    console.log(`Sheet "${name}" has ${count} valid rows with data in Col C`);
});
