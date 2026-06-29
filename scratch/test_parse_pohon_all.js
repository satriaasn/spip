const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
console.log('Loading workbook from:', excelPath);
const workbook = xlsx.readFile(excelPath);

function getCleanVal(sheet, cellAddr) {
    const cell = sheet[cellAddr];
    return cell && cell.v !== undefined ? String(cell.v).trim() : '';
}

function isRowEmpty(sheet, row, cols) {
    return cols.every(col => !getCleanVal(sheet, `${col}${row}`));
}

// 4. Parse KEGIATAN (KKE 2.2)
const kegiatanNodes = [];
const s22 = workbook.Sheets['KKE 2.2 SASKEG'];
if (s22) {
    const ref = s22['!ref'];
    const range = xlsx.utils.decode_range(ref);
    for (let r = 15; r <= range.e.r + 1; r++) {
        if (isRowEmpty(s22, r, ['B', 'D', 'E', 'G', 'H', 'J', 'K', 'L', 'M'])) continue;
        const pemdaTitle = getCleanVal(s22, `B${r}`);
        const opdName = getCleanVal(s22, `D${r}`);
        const opdObjective = getCleanVal(s22, `E${r}`);
        const programName = getCleanVal(s22, `G${r}`);
        const programObjective = getCleanVal(s22, `H${r}`);
        const opdCode = getCleanVal(s22, `J${r}`);
        const kegiatanName = getCleanVal(s22, `K${r}`);
        const title = getCleanVal(s22, `L${r}`);
        const indicator = getCleanVal(s22, `M${r}`);
        const target = getCleanVal(s22, `N${r}`);
        const unit = getCleanVal(s22, `O${r}`);

        const actualPemdaTitle = pemdaTitle || (kegiatanNodes.length > 0 ? kegiatanNodes[kegiatanNodes.length - 1].pemdaTitle : '');
        const actualOpdName = opdName || (kegiatanNodes.length > 0 ? kegiatanNodes[kegiatanNodes.length - 1].opdName : '');
        const actualOpdObjective = opdObjective || (kegiatanNodes.length > 0 ? kegiatanNodes[kegiatanNodes.length - 1].opdObjective : '');
        const actualProgramName = programName || (kegiatanNodes.length > 0 ? kegiatanNodes[kegiatanNodes.length - 1].programName : '');
        const actualProgramObjective = programObjective || (kegiatanNodes.length > 0 ? kegiatanNodes[kegiatanNodes.length - 1].programObjective : '');
        const actualOpdCode = opdCode || (kegiatanNodes.length > 0 ? kegiatanNodes[kegiatanNodes.length - 1].opdCode : '');
        const actualKegiatanName = kegiatanName || (kegiatanNodes.length > 0 ? kegiatanNodes[kegiatanNodes.length - 1].kegiatanName : '');
        const actualTitle = title || (kegiatanNodes.length > 0 ? kegiatanNodes[kegiatanNodes.length - 1].title : '');

        kegiatanNodes.push({
            row: r,
            pemdaTitle: actualPemdaTitle,
            opdName: actualOpdName,
            opdObjective: actualOpdObjective,
            programName: actualProgramName,
            programObjective: actualProgramObjective,
            opdCode: actualOpdCode,
            kegiatanName: actualKegiatanName,
            title: actualTitle,
            indicator,
            target,
            unit
        });
    }
}
console.log(`Found ${kegiatanNodes.length} KEGIATAN level indicators.`);

// 5. Parse SUB_KEGIATAN (KKE 2.3)
const subKegNodes = [];
const s23 = workbook.Sheets['KKE 2.3 SASSUBKEG'];
if (s23) {
    const ref = s23['!ref'];
    const range = xlsx.utils.decode_range(ref);
    for (let r = 15; r <= range.e.r + 1; r++) {
        if (isRowEmpty(s23, r, ['B', 'D', 'E', 'G', 'H', 'J', 'K', 'L', 'N', 'O', 'P'])) continue;
        const pemdaTitle = getCleanVal(s23, `B${r}`);
        const opdName = getCleanVal(s23, `D${r}`);
        const opdObjective = getCleanVal(s23, `E${r}`);
        const programName = getCleanVal(s23, `G${r}`);
        const programObjective = getCleanVal(s23, `H${r}`);
        const opdCode = getCleanVal(s23, `J${r}`);
        const kegiatanName = getCleanVal(s23, `K${r}`);
        const kegiatanObjective = getCleanVal(s23, `L${r}`);
        const subKegName = getCleanVal(s23, `N${r}`);
        const title = getCleanVal(s23, `O${r}`);
        const indicator = getCleanVal(s23, `P${r}`);
        const target = getCleanVal(s23, `Q${r}`);
        const unit = getCleanVal(s23, `R${r}`);

        const actualPemdaTitle = pemdaTitle || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].pemdaTitle : '');
        const actualOpdName = opdName || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].opdName : '');
        const actualOpdObjective = opdObjective || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].opdObjective : '');
        const actualProgramName = programName || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].programName : '');
        const actualProgramObjective = programObjective || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].programObjective : '');
        const actualOpdCode = opdCode || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].opdCode : '');
        const actualKegiatanName = kegiatanName || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].kegiatanName : '');
        const actualKegiatanObjective = kegiatanObjective || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].kegiatanObjective : '');
        const actualSubKegName = subKegName || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].subKegName : '');
        const actualTitle = title || (subKegNodes.length > 0 ? subKegNodes[subKegNodes.length - 1].title : '');

        subKegNodes.push({
            row: r,
            pemdaTitle: actualPemdaTitle,
            opdName: actualOpdName,
            opdObjective: actualOpdObjective,
            programName: actualProgramName,
            programObjective: actualProgramObjective,
            opdCode: actualOpdCode,
            kegiatanName: actualKegiatanName,
            kegiatanObjective: actualKegiatanObjective,
            subKegName: actualSubKegName,
            title: actualTitle,
            indicator,
            target,
            unit
        });
    }
}
console.log(`Found ${subKegNodes.length} SUB_KEGIATAN level indicators.`);
