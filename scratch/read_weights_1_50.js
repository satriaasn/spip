const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KKLEAD_SPIP'];

console.log('Row | Col A | Col B | Col C | Col D | Col E | Col F | Col G | Col H | Col I');
console.log('-----------------------------------------------------------------------------');

for (let r = 1; r <= 50; r++) {
    const row = {};
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    let hasData = false;
    cols.forEach(col => {
        const cell = sheet[`${col}${r}`];
        if (cell) {
            row[col] = cell.f ? `${cell.v} (f: ${cell.f})` : cell.v;
            hasData = true;
        } else {
            row[col] = '';
        }
    });
    if (hasData) {
        console.log(`${r.toString().padStart(3)} | ${String(row.A).substring(0, 15).padEnd(15)} | ${String(row.B).substring(0, 15).padEnd(15)} | ${String(row.C).substring(0, 15).padEnd(15)} | ${String(row.D).substring(0, 15).padEnd(15)} | ${String(row.E).substring(0, 15).padEnd(15)} | ${String(row.F).substring(0, 15).padEnd(15)} | ${String(row.G).substring(0, 15).padEnd(15)} | ${String(row.H).substring(0, 15).padEnd(15)} | ${String(row.I).substring(0, 15).padEnd(15)}`);
    }
}
