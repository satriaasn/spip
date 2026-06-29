const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const sheets = ['KKLEAD_SPIP', 'KKLEAD I', 'KKLEAD II', 'KKLEAD III'];

sheets.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.log(`${sheetName} not found`);
        return;
    }
    console.log(`\n==================== ${sheetName} ====================`);
    const range = xlsx.utils.decode_range(sheet['!ref']);
    // Print first 50 rows
    for (let r = 1; r <= 60; r++) {
        let rowStr = `Row ${r.toString().padStart(2)}: `;
        let hasData = false;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
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
