const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    const cols = ['M', 'N', 'O', 'P', 'Q', 'R'];
    console.log('Scanning rows 1-10 for columns M to R:');
    for (let r = 1; r <= 10; r++) {
        let rowStr = `Row ${r}: `;
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            rowStr += `${col}: ${cell ? JSON.stringify(cell.v) : 'empty'} | `;
        });
        console.log(rowStr);
    }
}
