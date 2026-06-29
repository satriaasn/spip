const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
console.log('Loading workbook from:', excelPath);

const workbook = xlsx.readFile(excelPath, { bookDeps: true });
console.log('Sheet Names:', workbook.SheetNames);
