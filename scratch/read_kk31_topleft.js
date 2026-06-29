const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('Row | Col A | Col B | Col C | Col D | Col E | Col F | Col G | Col H | Col I | Col J | Col K | Col L');
    console.log('------------------------------------------------------------------------------------------------------');
    for (let r = 1; r <= 15; r++) {
        const row = {};
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            row[col] = cell ? String(cell.v).replace(/\n/g, ' ') : '';
        });
        console.log(`${r.toString().padStart(2)} | ${row.A.substring(0, 10).padEnd(10)} | ${row.B.substring(0, 10).padEnd(10)} | ${row.C.substring(0, 10).padEnd(10)} | ${row.D.substring(0, 10).padEnd(10)} | ${row.E.substring(0, 10).padEnd(10)} | ${row.F.substring(0, 10).padEnd(10)} | ${row.G.substring(0, 10).padEnd(10)} | ${row.H.substring(0, 10).padEnd(10)} | ${row.I.substring(0, 10).padEnd(10)} | ${row.J.substring(0, 10).padEnd(10)} | ${row.K.substring(0, 10).padEnd(10)} | ${row.L.substring(0, 10).padEnd(10)}`);
    }
}
