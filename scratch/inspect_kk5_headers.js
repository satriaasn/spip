const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const targetSheets = ['KK 5.1 A', 'KK 5.1 B ', 'KK 5.2'];

targetSheets.forEach(name => {
    const s = workbook.Sheets[name];
    if (!s) {
        console.log(`Sheet "${name}" not found`);
        return;
    }
    console.log(`\n=================== Sheet: ${name} ===================`);
    const range = xlsx.utils.decode_range(s['!ref']);
    for (let r = 8; r <= 15; r++) {
        let rowStr = `Row ${r}: `;
        let hasData = false;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
        cols.forEach(col => {
            const cell = s[`${col}${r}`];
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
