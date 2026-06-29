const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);

function checkSheet(name) {
    const sheet = workbook.Sheets[name];
    if (sheet) {
        console.log(`\n=== ${name} range: ${sheet['!ref']} ===`);
        let count = 0;
        for (const cell in sheet) {
            if (cell[0] === '!') continue;
            const r = parseInt(cell.replace(/\D/g, ''));
            const c = cell.replace(/\d/g, '');
            if (r <= 20 && ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(c)) {
                console.log(`${cell}: ${sheet[cell].v}`);
                count++;
                if (count > 20) break;
            }
        }
    } else {
        console.log(`${name} not found`);
    }
}

checkSheet('KK 7');
checkSheet('KK 6');
checkSheet('KK 8');
