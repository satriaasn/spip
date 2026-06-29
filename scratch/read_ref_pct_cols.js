const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['Ref PCT'];

if (!sheet) {
    console.log('Ref PCT not found');
} else {
    const range = sheet['!ref'];
    console.log('Ref PCT range:', range);
    // Print row 1-20 columns A-O
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
    console.log('Row | ' + cols.join(' | '));
    console.log('----------------------------------------------------------------------');
    for (let r = 1; r <= 20; r++) {
        const rowVals = cols.map(col => {
            const cell = sheet[`${col}${r}`];
            if (!cell) return '';
            const val = String(cell.v).replace(/\n/g, ' ').substring(0, 15);
            return cell.f ? `${val} (f)` : val;
        });
        console.log(`${r.toString().padStart(3)} | ${rowVals.join(' | ')}`);
    }
}
