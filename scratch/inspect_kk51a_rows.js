const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK 5.1 A'];

if (!sheet) {
    console.log('KK 5.1 A not found');
} else {
    const range = xlsx.utils.decode_range(sheet['!ref']);
    console.log(`KK 5.1 A total rows: ${range.e.r + 1}`);
    for (let r = 10; r <= 35; r++) {
        let rowStr = `Row ${r + 1}: `;
        let hasData = false;
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
        cols.forEach(col => {
            const cell = sheet[`${col}${r + 1}`];
            if (cell) {
                hasData = true;
                rowStr += `${col}: ${cell.v} | `;
            }
        });
        if (hasData) {
            console.log(rowStr.slice(0, -3));
        }
    }
}
