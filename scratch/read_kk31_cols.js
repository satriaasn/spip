const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    // Columns RZ, SA, SB, SC, SD
    const cols = ['RZ', 'SA', 'SB', 'SC', 'SD'];
    console.log('Row 10 values:');
    cols.forEach(col => {
        const cell = sheet[`${col}10`];
        console.log(`${col}10: ${cell ? cell.v : 'empty'}`);
    });

    console.log('\nRow 202 values:');
    cols.forEach(col => {
        const cell = sheet[`${col}202`];
        console.log(`${col}202: Value = ${cell ? cell.v : 'empty'} | Formula = ${cell && cell.f ? cell.f : 'None'}`);
    });
}
