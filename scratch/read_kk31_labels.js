const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('Row | Col A | Col B | Col C | Col D | Col E');
    console.log('--------------------------------------------------');
    for (let r = 195; r <= 250; r++) {
        const cols = ['A', 'B', 'C', 'D', 'E'];
        let rowStr = '';
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            if (cell && cell.v !== undefined && cell.v !== '') {
                rowStr += `${col}: ${cell.v} | `;
            }
        });
        if (rowStr) {
            console.log(`${r.toString().padStart(3)} | ${rowStr}`);
        }
    }
}
