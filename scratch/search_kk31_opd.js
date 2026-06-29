const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('Searching for OPD names in KK3.1:');
    let foundCount = 0;
    for (const cellAddress in sheet) {
        if (cellAddress[0] === '!') continue;
        const cell = sheet[cellAddress];
        const valStr = String(cell.v || '').toLowerCase();
        if (valStr.includes('perencanaan') || valStr.includes('perpustakaan') || valStr.includes('inspektorat') || valStr.includes('opd 1')) {
            console.log(`  [${cellAddress}]: ${cell.v}`);
            foundCount++;
            if (foundCount > 30) {
                console.log('... truncated ...');
                break;
            }
        }
    }
}
