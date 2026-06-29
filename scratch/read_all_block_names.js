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

    console.log('Listing OPD names from row 6 of each block (last column):');
    console.log('Index | Start Col | End Col | OPD Name');
    console.log('--------------------------------------------------');
    for (let i = 0; i < 80; i++) {
        const startIdx = 12 + i * 6; // Starts at M (index 12)
        const endIdx = startIdx + 5; // Ends at R (index 17)
        const startCol = getColName(startIdx);
        const endCol = getColName(endIdx);
        const cell = sheet[`${endCol}6`];
        const opdName = cell ? cell.v : 'empty';
        if (opdName && opdName !== 'empty' && opdName !== '') {
            console.log(`${i.toString().padStart(2)} | ${startCol.padEnd(3)} | ${endCol.padEnd(3)} | ${opdName}`);
        }
    }
}
