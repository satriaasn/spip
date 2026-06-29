const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);

['KK3.1', 'KK3.2', 'KK3.3', 'KK3.4'].forEach(name => {
    const sheet = workbook.Sheets[name];
    if (sheet) {
        console.log(`\n=== ${name} ===`);
        console.log(`A3: ${sheet['A3'] ? sheet['A3'].v : 'empty'}`);
        console.log(`A4: ${sheet['A4'] ? sheet['A4'].v : 'empty'}`);
        console.log(`B4: ${sheet['B4'] ? sheet['B4'].v : 'empty'}`);
        console.log(`C4: ${sheet['C4'] ? sheet['C4'].v : 'empty'}`);
    }
});
