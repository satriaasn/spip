const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    const cols = ['M', 'N', 'O', 'P', 'Q', 'R'];
    console.log('First block cells (rows 1-10):');
    for (let r = 1; r <= 10; r++) {
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell && cell.v !== undefined && cell.v !== '') {
                console.log(`${col}${r}: "${cell.v}" | Formula = ${cell.f || 'None'}`);
            }
        });
    }
}
