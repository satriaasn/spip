const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);

['KK3.1', 'KK3.2', 'KK3.3', 'KK3.4'].forEach(name => {
    const sheet = workbook.Sheets[name];
    if (sheet) {
        console.log(`${name} range: ${sheet['!ref']}`);
        // Print cell D11 (first indicator description)
        console.log(`${name} D11: ${sheet['D11'] ? sheet['D11'].v.substring(0, 50) : 'empty'}`);
    } else {
        console.log(`${name} not found`);
    }
});
