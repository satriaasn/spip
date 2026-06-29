const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const sheetsToTest = [
    'KK3.1', 'KK3.2', 'KK3.3', 'KK3.4',
    'KK 5.1 A', 'KK 5.1 B ', 'KK 5.1 C', 'KK 5.2',
    'KK 6', 'KK 7', 'KK 8'
];

sheetsToTest.forEach(name => {
    const sheet = workbook.Sheets[name];
    if (!sheet) {
        console.log(`Sheet "${name}" not found.`);
        return;
    }
    console.log(`\n--- Sheet: ${name} ---`);
    for (let r = 1; r <= 8; r++) {
        const valA = sheet[`A${r}`] ? sheet[`A${r}`].v : '';
        const valB = sheet[`B${r}`] ? sheet[`B${r}`].v : '';
        const valC = sheet[`C${r}`] ? sheet[`C${r}`].v : '';
        const valD = sheet[`D${r}`] ? sheet[`D${r}`].v : '';
        const valE = sheet[`E${r}`] ? sheet[`E${r}`].v : '';
        const valF = sheet[`F${r}`] ? sheet[`F${r}`].v : '';
        const valG = sheet[`G${r}`] ? sheet[`G${r}`].v : '';
        const valH = sheet[`H${r}`] ? sheet[`H${r}`].v : '';
        const valI = sheet[`I${r}`] ? sheet[`I${r}`].v : '';
        const valJ = sheet[`J${r}`] ? sheet[`J${r}`].v : '';
        const valK = sheet[`K${r}`] ? sheet[`K${r}`].v : '';
        const valL = sheet[`L${r}`] ? sheet[`L${r}`].v : '';
        const valM = sheet[`M${r}`] ? sheet[`M${r}`].v : '';
        
        let rowStr = `Row ${r}: `;
        if (valA) rowStr += `A: ${valA} | `;
        if (valB) rowStr += `B: ${valB} | `;
        if (valC) rowStr += `C: ${valC} | `;
        if (valD) rowStr += `D: ${valD} | `;
        if (valE) rowStr += `E: ${valE} | `;
        if (valF) rowStr += `F: ${valF} | `;
        if (valG) rowStr += `G: ${valG} | `;
        if (valH) rowStr += `H: ${valH} | `;
        if (valI) rowStr += `I: ${valI} | `;
        if (valJ) rowStr += `J: ${valJ} | `;
        if (valK) rowStr += `K: ${valK} | `;
        if (valL) rowStr += `L: ${valL} | `;
        if (valM) rowStr += `M: ${valM} | `;
        if (rowStr !== `Row ${r}: `) {
            console.log(rowStr.slice(0, -3));
        }
    }
});
