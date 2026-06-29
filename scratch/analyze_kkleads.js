const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
console.log('Loading workbook from:', excelPath);

const workbook = xlsx.readFile(excelPath);

function analyzeLeadSheet(sheetName, startRow = 1, endRow = 50) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.log(`Sheet ${sheetName} not found.`);
        return;
    }
    console.log(`\n==================================================`);
    console.log(`ANALYSIS OF SHEET: ${sheetName}`);
    console.log(`==================================================`);

    for (let r = startRow; r <= endRow; r++) {
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
        let rowContent = [];
        let hasData = false;
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell) {
                hasData = true;
                const val = cell.v !== undefined ? cell.v : '';
                const form = cell.f ? ` [f: ${cell.f}]` : '';
                rowContent.push(`${col}: ${String(val).replace(/\n/g, ' ').substring(0, 50)}${form}`);
            }
        });
        if (hasData) {
            console.log(`Row ${r.toString().padStart(3)}: ${rowContent.join(' | ')}`);
        }
    }
}

analyzeLeadSheet('KKLEAD_SPIP', 1, 40);
analyzeLeadSheet('KKLEAD I', 1, 30);
analyzeLeadSheet('KKLEAD II', 1, 30);
analyzeLeadSheet('KKLEAD III', 1, 30);
