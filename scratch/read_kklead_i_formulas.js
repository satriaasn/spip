const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KKLEAD I'];

if (!sheet) {
    console.log('KKLEAD I not found');
} else {
    console.log('KKLEAD I rows 10-40:');
    for (let r = 10; r <= 40; r++) {
        const row = {};
        const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        cols.forEach(col => {
            const cell = sheet[`${col}${r}`];
            row[col] = cell ? String(cell.v).replace(/\n/g, ' ') : '';
        });
        if (row.A || row.B || row.C || row.D || row.E || row.F || row.G || row.H || row.I || row.J) {
            console.log(`${r.toString().padStart(2)} | A: ${row.A.substring(0,10)} | B: ${row.B.substring(0,15)} | I: ${sheet[`I${r}`] ? sheet[`I${r}`].v : ''} | I_f: ${sheet[`I${r}`] && sheet[`I${r}`].f ? sheet[`I${r}`].f : 'None'}`);
        }
    }
}
