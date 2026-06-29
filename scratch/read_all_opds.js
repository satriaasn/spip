const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['Ref PCT'];

if (!sheet) {
    console.log('Ref PCT sheet not found');
} else {
    console.log('Listing OPDs from Ref PCT (Column I):');
    const opds = new Set();
    for (let r = 2; r <= 200; r++) {
        const cell = sheet[`I${r}`];
        if (cell && cell.v !== undefined && cell.v !== '') {
            opds.add(cell.v.trim());
            console.log(`Row ${r}: ${cell.v}`);
        }
    }
    console.log('Total unique OPDs found in Column I:', opds.size);
}
