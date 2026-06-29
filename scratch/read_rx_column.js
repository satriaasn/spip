const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('KK3.1 column RX (rows 8-20):');
    for (let r = 8; r <= 20; r++) {
        const cell = sheet[`RX${r}`];
        if (cell) {
            console.log(`Row ${r}: val=${cell.v}, formula=${cell.f || 'none'}`);
        } else {
            console.log(`Row ${r}: empty`);
        }
    }
}
