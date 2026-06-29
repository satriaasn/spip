const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const targetSheets = ['KK3.1', 'KK3.2', 'KK3.3', 'KK3.4', 'KK 6', 'KK 7', 'KK 8'];

targetSheets.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.log(`Sheet ${sheetName} not found.`);
        return;
    }
    console.log(`\n=================== SEARCHING IN SHEET ${sheetName} ===================`);
    
    // Scan all cells in the sheet for names
    let found = [];
    for (const cellAddress in sheet) {
        if (cellAddress[0] === '!') continue;
        const cell = sheet[cellAddress];
        const valStr = String(cell.v || '').toLowerCase();
        if (valStr.includes('bappeda') || valStr.includes('bpkad') || valStr.includes('inspektorat') || valStr.includes('inspektur')) {
            found.push(`${cellAddress}: ${cell.v}`);
        }
    }
    if (found.length === 0) {
        console.log('No matches found.');
    } else {
        console.log(`Found ${found.length} matches. Sample (first 10):`);
        found.slice(0, 10).forEach(f => console.log('  ', f));
    }
});
