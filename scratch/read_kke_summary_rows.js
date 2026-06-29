const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const sheets = ['KKE 1.1 SASTRA', 'KKE 1.2 SASTRA OPD', 'KKE 2.1 SASPRO', 'KKE 2.2 SASKEG', 'KKE 2.3 SASSUBKEG'];

sheets.forEach(sheetName => {
    const s = workbook.Sheets[sheetName];
    if (!s) return;
    console.log(`\n--- ${sheetName} ---`);
    for (let r = 5; r <= 8; r++) {
        let rowStr = `Row ${r}: `;
        const cols = ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI'];
        cols.forEach(col => {
            const cell = s[`${col}${r}`];
            if (cell) {
                rowStr += `${col}: ${cell.v}${cell.f ? ` [f: ${cell.f}]` : ''} | `;
            }
        });
        console.log(rowStr);
    }
});
