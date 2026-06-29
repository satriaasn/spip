const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KKLEAD I'];

if (!sheet) {
    console.log('KKLEAD I not found');
} else {
    console.log('KKLEAD I contents (Rows 35 to 60):');
    for (let r = 35; r <= 60; r++) {
        let rowStr = `Row ${r.toString().padStart(2)}: `;
        let hasData = false;
        for (let c = 0; c <= 12; c++) {
            const colLetter = xlsx.utils.encode_col(c);
            const cell = sheet[`${colLetter}${r}`];
            if (cell) {
                hasData = true;
                const val = cell.v !== undefined ? cell.v : '';
                const form = cell.f ? ` [f: ${cell.f}]` : '';
                rowStr += `${colLetter}: ${String(val).replace(/\n/g, ' ')}${form} | `;
            }
        }
        if (hasData) {
            console.log(rowStr.slice(0, -3));
        }
    }
}
