const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KKLEAD_SPIP'];

if (!sheet) {
    console.log('KKLEAD_SPIP not found');
} else {
    console.log('KKLEAD_SPIP rows 1-50:');
    for (let r = 1; r <= 50; r++) {
        let rowStr = `Row ${r.toString().padStart(2)}: `;
        let hasData = false;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell) {
                hasData = true;
                const val = cell.v !== undefined ? cell.v : '';
                const form = cell.f ? ` [f: ${cell.f}]` : '';
                rowStr += `${col}: ${String(val).replace(/\n/g, ' ').substring(0, 35)}${form} | `;
            }
        });
        if (hasData) {
            console.log(rowStr.slice(0, -3));
        }
    }
}
