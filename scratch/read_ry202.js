const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    const cell = sheet['RY202'];
    console.log(`RY202: Value = ${cell ? cell.v : 'empty'} | Formula = ${cell && cell.f ? cell.f : 'None'}`);
}
