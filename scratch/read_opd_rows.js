const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['NAMA OPD'];

if (!sheet) {
    console.log('NAMA OPD sheet not found');
} else {
    for (let r = 7; r <= 46; r++) {
        const valC = sheet[`C${r}`] ? sheet[`C${r}`].v : '';
        const valD = sheet[`D${r}`] ? sheet[`D${r}`].v : '';
        console.log(`${r.toString().padStart(3)} | C: "${valC}" | D: "${valD}"`);
    }
}
