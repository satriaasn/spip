const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.4'];

if (!sheet) {
    console.log('KK3.4 not found');
} else {
    console.log('KK3.4 Column RX cells:');
    for (let r = 1; r <= 30; r++) {
        const cell = sheet[`RX${r}`];
        if (cell) {
            console.log(`Row ${r.toString().padStart(2)}: RX${r} = ${cell.v} ${cell.f ? '[f: ' + cell.f + ']' : ''}`);
        }
    }
}
