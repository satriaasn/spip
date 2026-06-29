const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);

function dumpSheetFormulas(sheetName, maxRows = 100) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.log(`Sheet ${sheetName} not found.`);
        return;
    }
    console.log(`\n==================== ${sheetName} ====================`);
    for (let r = 1; r <= maxRows; r++) {
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
        let rowStr = '';
        let hasFormula = false;
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell) {
                if (cell.f) {
                    rowStr += `${col}${r}: [f: ${cell.f} => v: ${cell.v}] | `;
                    hasFormula = true;
                } else if (cell.v !== undefined && cell.v !== '') {
                    // rowStr += `${col}${r}: ${cell.v} | `;
                }
            }
        });
        if (hasFormula) {
            console.log(`Row ${r}: ${rowStr}`);
        }
    }
}

dumpSheetFormulas('KKLEAD I', 50);
dumpSheetFormulas('KKLEAD II', 100);
dumpSheetFormulas('KKLEAD III', 50);
