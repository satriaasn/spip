const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
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

    console.log('Listing all 80 blocks in KK3.1:');
    for (let i = 0; i < 80; i++) {
        const startIdx = 12 + i * 6; // Starts at M (index 12)
        const startCol = getColName(startIdx);
        const endCol = getColName(startIdx + 5);
        const cell = sheet[`${endCol}6`];
        const val = cell ? cell.v : '(empty)';
        if (val !== '(empty)' && val.trim() !== '') {
            console.log(`Block ${i.toString().padStart(2)}: Cols ${startCol}-${endCol} | OPD = "${val}"`);
        }
    }
}
