const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
console.log('Loading workbook from:', excelPath);
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    // Helper function to get Excel column name from index (0-based)
    function getColName(index) {
        let name = '';
        while (index >= 0) {
            name = String.fromCharCode((index % 26) + 65) + name;
            index = Math.floor(index / 26) - 1;
        }
        return name;
    }

    console.log('Scanning rows 1-20 for non-empty cells in the first few blocks (M, S, Y, AE, etc.):');
    const colsToCheck = [12, 18, 24, 30, 36, 42, 48, 54]; // M, S, Y, AE, AK, AQ, AW, BC
    colsToCheck.forEach(colIdx => {
        const colName = getColName(colIdx);
        console.log(`\n--- Column ${colName} (index ${colIdx}) ---`);
        for (let r = 1; r <= 20; r++) {
            const cell = sheet[`${colName}${r}`];
            if (cell && cell.v !== undefined && cell.v !== '') {
                console.log(`Row ${r}: "${String(cell.v).replace(/\n/g, ' ')}"`);
            }
        }
    });
}
