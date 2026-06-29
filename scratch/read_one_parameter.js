const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    const cols = ['A', 'B', 'C', 'D', 'E', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
    console.log('Inspecting first parameter (rows 10-15):');
    for (let r = 10; r <= 15; r++) {
        let rowStr = `Row ${r.toString().padStart(2)}: `;
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell) {
                rowStr += `${col}: ${JSON.stringify(cell.v)} | `;
            }
        });
        console.log(rowStr);
    }
}
