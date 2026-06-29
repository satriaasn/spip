const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const sheetsToTest = [
    'KKE 1.1 SASTRA',
    'KKE 1.2 SASTRA OPD',
    'KKE 2.1 SASPRO',
    'KKE 2.2 SASKEG',
    'KKE 2.3 SASSUBKEG'
];

sheetsToTest.forEach(name => {
    const sheet = workbook.Sheets[name];
    if (!sheet) {
        console.log(`Sheet "${name}" not found.`);
        return;
    }
    console.log(`\n=================== SHEET: ${name} ===================`);
    console.log(`Range: ${sheet['!ref']}`);
    
    // Print row 7 and 8 (which are typical headers) and first 3 data rows
    for (let r = 1; r <= 15; r++) {
        let rowContent = [];
        let hasData = false;
        // Scan columns A to R (indices 0 to 17)
        for (let c = 0; c < 18; c++) {
            const colLetter = xlsx.utils.encode_col(c);
            const cell = sheet[`${colLetter}${r}`];
            if (cell) {
                hasData = true;
                const val = cell.v !== undefined ? cell.v : '';
                const form = cell.f ? ` [f: ${cell.f}]` : '';
                rowContent.push(`${colLetter}: ${String(val).replace(/\n/g, ' ').substring(0, 50)}${form}`);
            }
        }
        if (hasData) {
            console.log(`Row ${r.toString().padStart(2)}: ${rowContent.join(' | ')}`);
        }
    }
});
