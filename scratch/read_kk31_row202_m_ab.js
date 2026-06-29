const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    // Let's print values of Row 202 from Col M to Col AB
    const cols = ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB'];
    console.log('Row 202 Col M-AB values:');
    cols.forEach(col => {
        const cell = sheet[`${col}202`];
        console.log(`${col}202: Value = ${cell ? cell.v : 'empty'} | Formula = ${cell && cell.f ? cell.f : 'None'}`);
    });
}
