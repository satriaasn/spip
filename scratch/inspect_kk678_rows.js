const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const targetSheets = ['KK 6', 'KK 7', 'KK 8'];

targetSheets.forEach(name => {
    const s = workbook.Sheets[name];
    if (!s) return;
    const range = xlsx.utils.decode_range(s['!ref']);
    console.log(`\n--- ${name} total rows: ${range.e.r + 1} ---`);
    let count = 0;
    for (let r = 7; r <= range.e.r; r++) {
        const valA = s[`A${r + 1}`] ? String(s[`A${r + 1}`].v).trim() : '';
        const valB = s[`B${r + 1}`] ? String(s[`B${r + 1}`].v).trim() : '';
        const valD = s[`D${r + 1}`] ? String(s[`D${r + 1}`].v).trim() : '';
        const valH = s[`H${r + 1}`] ? String(s[`H${r + 1}`].v).trim() : '';
        const valI = s[`I${r + 1}`] ? String(s[`I${r + 1}`].v).trim() : '';
        const valJ = s[`J${r + 1}`] ? String(s[`J${r + 1}`].v).trim() : '';

        if (valA || valB || valD || valH || valI || valJ) {
            count++;
            if (count <= 10) {
                console.log(`Row ${r + 1}: A=${valA}, B=${valB}, D=${valD}, H=${valH}, I=${valI}, J=${valJ}`);
            }
        }
    }
    console.log(`Total filled rows: ${count}`);
});
