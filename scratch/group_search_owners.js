const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const targetSheets = ['KK3.1', 'KK3.2', 'KK3.3', 'KK3.4', 'KK 6', 'KK 7', 'KK 8'];

targetSheets.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        return;
    }
    console.log(`\n=================== SHEET: ${sheetName} ===================`);
    
    // Find sheet description/title in row 4
    const titleCell = sheet['A4'] || sheet['A3'] || sheet['B4'];
    console.log(`Title/A4: ${titleCell ? titleCell.v : 'Not Found'}`);
    
    // Scan all cells in the sheet for names and print first 5 matches with coordinates
    let matches = [];
    for (const cellAddress in sheet) {
        if (cellAddress[0] === '!') continue;
        const cell = sheet[cellAddress];
        const valStr = String(cell.v || '').toLowerCase();
        if (valStr.includes('bappeda') || valStr.includes('bpkad') || valStr.includes('inspektorat') || valStr.includes('inspektur')) {
            matches.push({ addr: cellAddress, text: String(cell.v).replace(/\n/g, ' ').substring(0, 80) });
        }
    }
    console.log(`Total Keyword Matches: ${matches.length}`);
    matches.slice(0, 5).forEach(m => {
        console.log(`  [${m.addr}]: ${m.text}`);
    });
});
