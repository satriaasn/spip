const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    // Loop rows 1 to 20, print values of col M, S, Y, AE
    console.log('Row | Col M | Col S | Col Y | Col AE');
    console.log('-------------------------------------');
    for (let r = 1; r <= 20; r++) {
        const valM = sheet[`M${r}`] ? sheet[`M${r}`].v : '';
        const valS = sheet[`S${r}`] ? sheet[`S${r}`].v : '';
        const valY = sheet[`Y${r}`] ? sheet[`Y${r}`].v : '';
        const valAE = sheet[`AE${r}`] ? sheet[`AE${r}`].v : '';
        if (valM || valS || valY || valAE) {
            console.log(`${r.toString().padStart(3)} | ${String(valM).substring(0, 15).padEnd(15)} | ${String(valS).substring(0, 15).padEnd(15)} | ${String(valY).substring(0, 15).padEnd(15)} | ${String(valAE).substring(0, 15).padEnd(15)}`);
        }
    }
}
