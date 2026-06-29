const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

function inspectColumns(sheetName) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.log(`Sheet ${sheetName} not found.`);
        return;
    }
    console.log(`\n=================== COLUMNS OF ${sheetName} ===================`);
    
    // Read headers in row 9 and 10
    const cols = [];
    const range = xlsx.utils.decode_range(sheet['!ref']);
    const startCol = range.s.c;
    const endCol = Math.min(range.e.c, 40); // Limit to AN
    
    for (let c = startCol; c <= endCol; c++) {
        const colLetter = xlsx.utils.encode_col(c);
        const header1 = sheet[`${colLetter}9`] ? sheet[`${colLetter}9`].v : '';
        const header2 = sheet[`${colLetter}10`] ? sheet[`${colLetter}10`].v : '';
        if (header1 || header2) {
            cols.push(`${colLetter}: [${header1}] -> [${header2}]`);
        }
    }
    console.log(cols.join('\n'));
}

inspectColumns('KKE 1.1 SASTRA');
inspectColumns('KKE 1.2 SASTRA OPD');
inspectColumns('KKE 2.1 SASPRO');
inspectColumns('KKE 2.2 SASKEG');
inspectColumns('KKE 2.3 SASSUBKEG');
