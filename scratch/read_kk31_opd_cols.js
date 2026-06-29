const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('KK3.1 OPD Columns Inspection:');
    
    // We want to inspect columns from M onwards that are in the formula:
    // RS, RM, RG, RA, QU, QO, QI, QC, PW, PQ, PK, PE, OY, OS, OM, OG, OA, NU, NO, NI, NC, MW, MQ, MK, ME, LY, LS, LM, LG, LA, KU, KO, KI, KC, JW, JQ, JK, JE, IY, IS, IM, IG, IA, HU, HO, HI, HC, GW, GQ, GK, GE, FY, FS, FM, FG, FA, EU, EO, EI, EC, DW, DQ, DK, DE, CY, CS, CM, CG, CA, BU, BO, BI, BC, AW, AQ, AK, AE, Y, S, M
    const targetCols = [
        'M', 'S', 'Y', 'AE', 'AK', 'AQ', 'AW', 'BC', 'BI', 'BO', 'BU', 'CA', 'CG', 'CM', 'CS', 'CY',
        'DE', 'DK', 'DQ', 'DW', 'EC', 'EI', 'EO', 'EU', 'FA', 'FG', 'FM', 'FS', 'FY', 'GE', 'GK', 'GQ', 'GW',
        'HC', 'HI', 'HO', 'HU', 'IA', 'IG', 'IM', 'IS', 'IY', 'JE', 'JK', 'JQ', 'JW', 'KC', 'KI', 'KO', 'KU',
        'LA', 'LG', 'LM', 'LS', 'LY', 'ME', 'MK', 'MQ', 'MW', 'NC', 'NI', 'NO', 'NU', 'OA', 'OG', 'OM', 'OS', 'OY',
        'PE', 'PK', 'PQ', 'PW', 'QC', 'QI', 'QO', 'QU', 'RA', 'RG', 'RM', 'RS'
    ];

    targetCols.forEach(col => {
        const opdNameCell = sheet[`${col}6`]; // OPD Name is usually at row 6
        const val = opdNameCell ? opdNameCell.v : '(empty)';
        console.log(`Column ${col}: ${val}`);
    });
}
