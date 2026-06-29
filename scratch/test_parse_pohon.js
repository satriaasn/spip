const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
console.log('Loading workbook from:', excelPath);
const workbook = xlsx.readFile(excelPath);

function getCleanVal(sheet, cellAddr) {
    const cell = sheet[cellAddr];
    return cell && cell.v !== undefined ? String(cell.v).trim() : '';
}

// Helper to check row content
function isRowEmpty(sheet, row, cols) {
    return cols.every(col => !getCleanVal(sheet, `${col}${row}`));
}

// 1. Parse PEMDA (KKE 1.1)
const pemdaNodes = [];
const s11 = workbook.Sheets['KKE 1.1 SASTRA'];
if (s11) {
    const ref = s11['!ref'];
    const range = xlsx.utils.decode_range(ref);
    // Data starts at row 14 (which is 1-based index 14, in decode_range it is index 13)
    for (let r = 14; r <= range.e.r + 1; r++) {
        if (isRowEmpty(s11, r, ['B', 'C', 'D', 'E'])) continue;
        const title = getCleanVal(s11, `B${r}`);
        const indicator = getCleanVal(s11, `C${r}`);
        const target = getCleanVal(s11, `D${r}`);
        const unit = getCleanVal(s11, `E${r}`);
        
        // If B is empty but C is not, it means it shares the same objective as the previous row
        const actualTitle = title || (pemdaNodes.length > 0 ? pemdaNodes[pemdaNodes.length - 1].title : '');
        
        pemdaNodes.push({
            row: r,
            title: actualTitle,
            indicator,
            target,
            unit
        });
    }
}
console.log(`Found ${pemdaNodes.length} PEMDA level indicators.`);

// 2. Parse OPD (KKE 1.2)
const opdNodes = [];
const s12 = workbook.Sheets['KKE 1.2 SASTRA OPD'];
if (s12) {
    const ref = s12['!ref'];
    const range = xlsx.utils.decode_range(ref);
    for (let r = 14; r <= range.e.r + 1; r++) {
        if (isRowEmpty(s12, r, ['B', 'D', 'E', 'F'])) continue;
        const pemdaTitle = getCleanVal(s12, `B${r}`);
        const opdName = getCleanVal(s12, `D${r}`);
        const title = getCleanVal(s12, `E${r}`);
        const indicator = getCleanVal(s12, `F${r}`);
        const target = getCleanVal(s12, `G${r}`);
        const unit = getCleanVal(s12, `H${r}`);

        // Handle merged cells fallbacks
        const actualPemdaTitle = pemdaTitle || (opdNodes.length > 0 ? opdNodes[opdNodes.length - 1].pemdaTitle : '');
        const actualOpdName = opdName || (opdNodes.length > 0 ? opdNodes[opdNodes.length - 1].opdName : '');
        const actualTitle = title || (opdNodes.length > 0 ? opdNodes[opdNodes.length - 1].title : '');

        opdNodes.push({
            row: r,
            pemdaTitle: actualPemdaTitle,
            opdName: actualOpdName,
            title: actualTitle,
            indicator,
            target,
            unit
        });
    }
}
console.log(`Found ${opdNodes.length} OPD level indicators.`);

// 3. Parse PROGRAM (KKE 2.1)
const programNodes = [];
const s21 = workbook.Sheets['KKE 2.1 SASPRO'];
if (s21) {
    const ref = s21['!ref'];
    const range = xlsx.utils.decode_range(ref);
    for (let r = 15; r <= range.e.r + 1; r++) {
        if (isRowEmpty(s21, r, ['B', 'D', 'E', 'G', 'H', 'I'])) continue;
        const pemdaTitle = getCleanVal(s21, `B${r}`);
        const opdName = getCleanVal(s21, `D${r}`);
        const parentIndicator = getCleanVal(s21, `E${r}`);
        const programName = getCleanVal(s21, `G${r}`);
        const title = getCleanVal(s21, `H${r}`);
        const indicator = getCleanVal(s21, `I${r}`);
        const target = getCleanVal(s21, `J${r}`);
        const unit = getCleanVal(s21, `K${r}`);

        const actualPemdaTitle = pemdaTitle || (programNodes.length > 0 ? programNodes[programNodes.length - 1].pemdaTitle : '');
        const actualOpdName = opdName || (programNodes.length > 0 ? programNodes[programNodes.length - 1].opdName : '');
        const actualParentIndicator = parentIndicator || (programNodes.length > 0 ? programNodes[programNodes.length - 1].parentIndicator : '');
        const actualProgramName = programName || (programNodes.length > 0 ? programNodes[programNodes.length - 1].programName : '');
        const actualTitle = title || (programNodes.length > 0 ? programNodes[programNodes.length - 1].title : '');

        programNodes.push({
            row: r,
            pemdaTitle: actualPemdaTitle,
            opdName: actualOpdName,
            parentIndicator: actualParentIndicator,
            programName: actualProgramName,
            title: actualTitle,
            indicator,
            target,
            unit
        });
    }
}
console.log(`Found ${programNodes.length} PROGRAM level indicators.`);
