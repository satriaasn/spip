const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('KK3.1 Bappeda Block Columns (L to Q):');
    const cols = ['L', 'M', 'N', 'O', 'P', 'Q'];
    for (let r = 5; r <= 9; r++) {
        let line = `Row ${r}: `;
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell) {
                line += `${col}: ${cell.v} | `;
            } else {
                line += `${col}: (empty) | `;
            }
        });
        console.log(line);
    }
}
