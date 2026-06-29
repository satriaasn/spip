const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['NAMA OPD'];

if (!sheet) {
    console.log('NAMA OPD sheet not found');
} else {
    console.log('Listing non-empty cells in NAMA OPD:');
    for (const cellAddress in sheet) {
        if (cellAddress[0] === '!') continue;
        const cell = sheet[cellAddress];
        if (cell.v !== undefined && cell.v !== '') {
            console.log(`${cellAddress}: ${cell.v}`);
        }
    }
}
