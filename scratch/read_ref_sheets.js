const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const refSheets = ['Ref PCT', 'REF', 'INDIKATOR HASIL'];

refSheets.forEach(name => {
    const sheet = workbook.Sheets[name];
    if (!sheet) {
        console.log(`Sheet ${name} not found.`);
        return;
    }
    console.log(`\n=================== REF SHEET: ${name} ===================`);
    console.log(`Range: ${sheet['!ref']}`);
    
    // Print first 15 rows
    for (let r = 1; r <= 15; r++) {
        let rowContent = [];
        let hasData = false;
        for (let c = 0; c < 15; c++) {
            const colLetter = xlsx.utils.encode_col(c);
            const cell = sheet[`${colLetter}${r}`];
            if (cell) {
                hasData = true;
                rowContent.push(`${colLetter}: ${String(cell.v).replace(/\n/g, ' ').substring(0, 45)}`);
            }
        }
        if (hasData) {
            console.log(`Row ${r.toString().padStart(2)}: ${rowContent.join(' | ')}`);
        }
    }
});
