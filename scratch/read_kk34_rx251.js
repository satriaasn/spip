const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.4'];

if (!sheet) {
    console.log('KK3.4 not found');
} else {
    console.log('KK3.4 RX251:');
    const cell = sheet[`RX251`];
    if (cell) {
        console.log(`RX251: val=${cell.v}, formula=${cell.f || 'none'}`);
    } else {
        console.log(`RX251: empty`);
    }
}
