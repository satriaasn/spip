const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('KK3.1 RY10:SD11 cells:');
    const cols = ['RY', 'RZ', 'SA', 'SB', 'SC', 'SD'];
    for (let r = 10; r <= 11; r++) {
        let line = `Row ${r}: `;
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell) {
                line += `${col}: ${cell.v} ${cell.f ? '[f: ' + cell.f + ']' : ''} | `;
            } else {
                line += `${col}: (empty) | `;
            }
        });
        console.log(line);
    }
}
