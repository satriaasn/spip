const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const targetSheets = ['KK 5.1 A', 'KK 5.1 B ', 'KK 5.1 C', 'KK 5.2', 'KK 6', 'KK 7', 'KK 8'];

targetSheets.forEach(name => {
    const s = workbook.Sheets[name];
    if (!s) {
        console.log(`Sheet "${name}" not found`);
        return;
    }
    console.log(`\n=================== Sheet: ${name} ===================`);
    const range = xlsx.utils.decode_range(s['!ref']);
    // Print first 15 rows
    const limitRow = Math.min(range.e.r, 20);
    for (let r = 0; r <= limitRow; r++) {
        let rowStr = `Row ${r + 1}: `;
        let hasData = false;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
        cols.forEach(col => {
            const cell = s[`${col}${r + 1}`];
            if (cell) {
                hasData = true;
                const val = cell.v !== undefined ? cell.v : '';
                const form = cell.f ? ` [f: ${cell.f}]` : '';
                rowStr += `${col}: ${String(val).replace(/\n/g, ' ').substring(0, 30)}${form} | `;
            }
        });
        if (hasData) {
            console.log(rowStr.slice(0, -3));
        }
    }
});
