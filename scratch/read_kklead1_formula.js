const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KKLEAD I'];

if (!sheet) {
    console.log('KKLEAD I not found');
} else {
    console.log('KKLEAD I rows:');
    const range = xlsx.utils.decode_range(sheet['!ref']);
    for (let r = 1; r <= range.e.r + 1; r++) {
        let rowStr = `Row ${r.toString().padStart(2)}: `;
        let hasData = false;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
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
