const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);

const cells = [
    { sheet: 'KKE 1.1 SASTRA', addr: 'F8' },
    { sheet: 'KKE 1.1 SASTRA', addr: 'K8' },
    { sheet: 'KKE 1.1 SASTRA', addr: 'P8' },
    { sheet: 'KKE 1.2 SASTRA OPD', addr: 'I8' },
    { sheet: 'KKE 1.2 SASTRA OPD', addr: 'N8' },
    { sheet: 'KKE 1.2 SASTRA OPD', addr: 'S8' },
    { sheet: 'KKE 1.2 SASTRA OPD', addr: 'X8' },
    { sheet: 'KKE 2.1 SASPRO', addr: 'L8' },
    { sheet: 'KKE 2.1 SASPRO', addr: 'Q8' },
    { sheet: 'KKE 2.1 SASPRO', addr: 'V8' },
    { sheet: 'KKE 2.1 SASPRO', addr: 'AA8' },
    { sheet: 'KKE 2.2 SASKEG', addr: 'P8' },
    { sheet: 'KKE 2.2 SASKEG', addr: 'U8' },
    { sheet: 'KKE 2.2 SASKEG', addr: 'Z8' },
    { sheet: 'KKE 2.2 SASKEG', addr: 'AE8' },
    { sheet: 'KKE 2.3 SASSUBKEG', addr: 'S8' },
    { sheet: 'KKE 2.3 SASSUBKEG', addr: 'X8' },
    { sheet: 'KKE 2.3 SASSUBKEG', addr: 'AC8' }
];

cells.forEach(c => {
    const s = workbook.Sheets[c.sheet];
    if (!s) {
        console.log(`${c.sheet} not found`);
        return;
    }
    const cell = s[c.addr];
    if (cell) {
        console.log(`${c.sheet} [${c.addr}]: val=${cell.v}, formula=${cell.f || 'none'}`);
    } else {
        console.log(`${c.sheet} [${c.addr}]: empty`);
    }
});
