const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    // Loop rows 1 to 10, print values of col M, S, Y, AE
    console.log('Row | Col M | Col S | Col Y | Col AE');
    console.log('-------------------------------------');
    for (let r = 1; r <= 10; r++) {
        const valM = sheet[`M${r}`] ? sheet[`M${r}`].v : '';
        const valS = sheet[`S${r}`] ? sheet[`S${r}`].v : '';
        const valY = sheet[`Y${r}`] ? sheet[`Y${r}`].v : '';
        const valAE = sheet[`AE${r}`] ? sheet[`AE${r}`].v : '';
        console.log(`${r.toString().padStart(3)} | "${String(valM).replace(/\n/g, ' ')}" | "${String(valS).replace(/\n/g, ' ')}" | "${String(valY).replace(/\n/g, ' ')}" | "${String(valAE).replace(/\n/g, ' ')}"`);
    }
}
