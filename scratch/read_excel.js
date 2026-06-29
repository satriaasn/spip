const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
console.log('Loading workbook from:', excelPath);

const workbook = xlsx.readFile(excelPath, { bookDeps: true });
console.log('Sheet Names:', workbook.SheetNames);

// Inspect sheet KKLEAD_SPIP
const leadSheet = workbook.Sheets['KKLEAD_SPIP'];
if (leadSheet) {
    console.log('\n--- KKLEAD_SPIP Cells with Formulas ---');
    let count = 0;
    for (const cellAddress in leadSheet) {
        if (cellAddress[0] === '!') continue;
        const cell = leadSheet[cellAddress];
        if (cell.f) {
            console.log(`${cellAddress}: ${cell.f} | Value: ${cell.v}`);
            count++;
            if (count > 200) {
                console.log('... truncated ...');
                break;
            }
        }
    }
}
