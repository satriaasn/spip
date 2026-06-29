const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KKLEAD II'];

if (!sheet) {
    console.log('KKLEAD II not found');
} else {
    const range = xlsx.utils.decode_range(sheet['!ref']);
    const rows = [];
    
    for (let r = 8; r <= range.e.r + 1; r++) {
        const valA = sheet[`A${r}`] ? String(sheet[`A${r}`].v).trim() : '';
        const valB = sheet[`B${r}`] ? String(sheet[`B${r}`].v).trim() : '';
        const valC = sheet[`C${r}`] ? String(sheet[`C${r}`].v).trim() : '';
        const valD = sheet[`D${r}`] ? String(sheet[`D${r}`].v).trim() : '';
        const valE = sheet[`E${r}`] ? String(sheet[`E${r}`].v).trim() : '';
        
        if (valA || valB || valC || valD) {
            rows.push({
                rowNum: r,
                code: valA,
                subName: valB,
                paramNo: valC,
                paramDesc: valD,
                paramType: valE
            });
        }
    }
    
    fs.writeFileSync(path.join(__dirname, 'kklead2_rows.json'), JSON.stringify(rows, null, 2));
    console.log(`Extracted ${rows.length} rows from KKLEAD II to kklead2_rows.json`);
}
