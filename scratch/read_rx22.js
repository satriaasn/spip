const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('KK3.1 Row 22:');
    const cell = sheet[`RX22`];
    if (cell) {
        console.log(`RX22: val=${cell.v}, formula=${cell.f || 'none'}`);
    } else {
        console.log(`RX22: empty`);
    }
}
