const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.4'];

if (!sheet) {
    console.log('KK3.4 not found');
} else {
    console.log('KK3.4 Row values:');
    const rows = [11, 16, 21, 26, 31, 36, 41, 46];
    rows.forEach(r => {
        const cell = sheet[`RX${r}`];
        console.log(`RX${r}: ${cell ? cell.v : 'empty'}`);
    });
    console.log(`RX10: ${sheet['RX10'] ? sheet['RX10'].v : 'empty'}`);
}
