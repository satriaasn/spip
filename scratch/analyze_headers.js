const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
console.log('Loading workbook from:', excelPath);

const workbook = xlsx.readFile(excelPath);

function dumpRowRange(sheetName, start, end) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.log(`Sheet ${sheetName} not found.`);
        return;
    }
    console.log(`\n==================================================`);
    console.log(`SHEET: ${sheetName} (Rows ${start} to ${end})`);
    console.log(`==================================================`);
    
    // Find all columns used in these rows
    const range = xlsx.utils.decode_range(sheet['!ref']);
    const startCol = range.s.c;
    const endCol = Math.min(range.e.c, 26); // A-Z
    
    for (let r = start; r <= end; r++) {
        let rowContent = [];
        let hasData = false;
        for (let c = startCol; c <= endCol; c++) {
            const colLetter = xlsx.utils.encode_col(c);
            const cell = sheet[`${colLetter}${r}`];
            if (cell) {
                hasData = true;
                const val = cell.v !== undefined ? cell.v : '';
                rowContent.push(`${colLetter}: ${String(val).replace(/\n/g, ' ')}`);
            }
        }
        if (hasData) {
            console.log(`Row ${r.toString().padStart(3)}: ${rowContent.join(' | ')}`);
        }
    }
}

dumpRowRange('KKLEAD_SPIP', 1, 20);
dumpRowRange('KKLEAD I', 1, 20);
dumpRowRange('KKLEAD II', 1, 20);
dumpRowRange('KKLEAD III', 1, 20);
