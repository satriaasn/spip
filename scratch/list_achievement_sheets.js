const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheetNames = workbook.SheetNames;

console.log('Workbook sheet names:');
sheetNames.forEach((n, idx) => console.log(`${idx + 1}: ${n}`));
