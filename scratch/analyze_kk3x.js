const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

function checkSheetHeader(sheetName) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.log(`Sheet ${sheetName} not found.`);
        return;
    }
    console.log(`\n==================== HEADER OF ${sheetName} ====================`);
    for (let r = 1; r <= 15; r++) {
        let rowContent = [];
        let hasData = false;
        for (let c = 0; c < 15; c++) {
            const colLetter = xlsx.utils.encode_col(c);
            const cell = sheet[`${colLetter}${r}`];
            if (cell && cell.v !== undefined && cell.v !== '') {
                hasData = true;
                rowContent.push(`${colLetter}: ${String(cell.v).replace(/\n/g, ' ')}`);
            }
        }
        if (hasData) {
            console.log(`Row ${r}: ${rowContent.join(' | ')}`);
        }
    }
}

checkSheetHeader('KK3.1');
checkSheetHeader('KK3.2');
checkSheetHeader('KK3.3');
checkSheetHeader('KK3.4');
