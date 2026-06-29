const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    // We want to loop through the 80 column blocks and see what names are in rows 11, 12, 13, 14
    const cols = [];
    // Helper function to get Excel column name from index (0-based)
    function getColName(index) {
        let name = '';
        while (index >= 0) {
            name = String.fromCharCode((index % 26) + 65) + name;
            index = Math.floor(index / 26) - 1;
        }
        return name;
    }

    console.log('Index | Col | Row 11 | Row 12 | Row 13 | Row 14');
    console.log('--------------------------------------------------');
    for (let i = 0; i < 80; i++) {
        const colIdx = 12 + i * 6; // Starts at M (index 12)
        const colName = getColName(colIdx);
        const r11 = sheet[`${colName}11`] ? sheet[`${colName}11`].v : '';
        const r12 = sheet[`${colName}12`] ? sheet[`${colName}12`].v : '';
        const r13 = sheet[`${colName}13`] ? sheet[`${colName}13`].v : '';
        const r14 = sheet[`${colName}14`] ? sheet[`${colName}14`].v : '';
        
        // Print if there is any data
        if (r11 || r12 || r13 || r14) {
            console.log(`${i.toString().padStart(2)} | ${colName.padEnd(3)} | ${String(r11).substring(0, 15).padEnd(15)} | ${String(r12).substring(0, 15).padEnd(15)} | ${String(r13).substring(0, 15).padEnd(15)} | ${String(r14).substring(0, 15).padEnd(15)}`);
        }
    }
}
