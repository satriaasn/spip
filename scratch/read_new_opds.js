const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['NAMA OPD'];

if (!sheet) {
    console.log('NAMA OPD sheet not found');
} else {
    console.log('Range:', sheet['!ref']);
    for (let r = 1; r <= 100; r++) {
        const valA = sheet[`A${r}`] ? sheet[`A${r}`].v : '';
        const valB = sheet[`B${r}`] ? sheet[`B${r}`].v : '';
        const valC = sheet[`C${r}`] ? sheet[`C${r}`].v : '';
        const valD = sheet[`D${r}`] ? sheet[`D${r}`].v : '';
        if (valA || valB || valC || valD) {
            console.log(`${r.toString().padStart(3)} | A: ${valA} | B: ${valB} | C: ${valC} | D: ${valD}`);
        }
    }
}
