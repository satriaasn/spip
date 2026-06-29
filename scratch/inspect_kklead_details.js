const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

function dumpSheet(sheetName, maxRows) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.log(`${sheetName} not found`);
        return;
    }
    console.log(`\n==================== ${sheetName} (first ${maxRows} rows) ====================`);
    for (let r = 1; r <= maxRows; r++) {
        let rowStr = `Row ${r.toString().padStart(2)}: `;
        let hasData = false;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
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
}

dumpSheet('KKLEAD_SPIP', 35);
dumpSheet('KKLEAD I', 35);
dumpSheet('KKLEAD II', 25);
