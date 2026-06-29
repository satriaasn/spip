const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
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

    console.log('Checking all 80 column blocks for OPD names in rows 1 to 10:');
    for (let i = 0; i < 80; i++) {
        const colIdx = 12 + i * 6; // Starts at M (index 12)
        const colName = getColName(colIdx);
        for (let r = 1; r <= 10; r++) {
            const cell = sheet[`${colName}${r}`];
            if (cell && cell.v !== undefined && cell.v !== '') {
                console.log(`Block ${i} | Col ${colName} | Row ${r}: "${String(cell.v).replace(/\n/g, ' ')}" | Formula = ${cell.f || 'None'}`);
            }
        }
    }
}
