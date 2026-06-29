const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    // Print row 4, 5, 6 for columns M, S, Y, AE
    const cols = ['M', 'S', 'Y', 'AE'];
    cols.forEach(col => {
        for (let r = 2; r <= 7; r++) {
            const cell = sheet[`${col}${r}`];
            if (cell) {
                console.log(`${col}${r}: "${cell.v}"`);
            }
        }
    });
}
