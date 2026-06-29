const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.4'];

if (!sheet) {
    console.log('KK3.4 not found');
} else {
    console.log('KK3.4 RX10:');
    const cell = sheet[`RX10`];
    if (cell) {
        console.log(`RX10: val=${cell.v}, formula=${cell.f || 'none'}`);
    } else {
        console.log(`RX10: empty`);
    }
}
