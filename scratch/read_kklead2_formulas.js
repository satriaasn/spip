const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KKLEAD II'];

if (!sheet) {
    console.log('KKLEAD II not found');
} else {
    console.log('KKLEAD II rows 8-25:');
    for (let r = 8; r <= 25; r++) {
        let rowStr = `Row ${r.toString().padStart(2)}: `;
        let hasData = false;
        const cols = ['A', 'B', 'C', 'D', 'E', 'H', 'I', 'J', 'K', 'L'];
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell) {
                hasData = true;
                const val = cell.v !== undefined ? cell.v : '';
                const form = cell.f ? ` [f: ${cell.f}]` : '';
                rowStr += `${col}: ${String(val).replace(/\n/g, ' ').substring(0, 40)}${form} | `;
            }
        });
        if (hasData) {
            console.log(rowStr.slice(0, -3));
        }
    }
}
