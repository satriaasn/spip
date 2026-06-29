const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
console.log('Loading workbook...');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.error('KK3.1 sheet not found');
    process.exit(1);
}

// 1. Extract OPDs from row 6 of the 80 column blocks
const opds = [];
function getColName(index) {
    let name = '';
    while (index >= 0) {
        name = String.fromCharCode((index % 26) + 65) + name;
        index = Math.floor(index / 26) - 1;
    }
    return name;
}

for (let i = 0; i < 80; i++) {
    const startIdx = 12 + i * 6; // Starts at M (index 12)
    const endCol = getColName(startIdx + 5); // Ends at last col of block, e.g. R, X
    const cell = sheet[`${endCol}6`];
    let name = cell ? String(cell.v).trim() : '';
    if (name && name !== '' && !name.startsWith('OPD ')) {
        const code = `OPD_${(i + 1).toString().padStart(2, '0')}`;
        opds.push({ code, name });
    }
}
console.log(`Extracted ${opds.length} actual OPDs.`);

// 2. Extract Sub-elements, Indicators, and Grades
const subElements = [];
let currentSub = null;

for (let r = 10; r <= 260; r++) {
    let valA = sheet[`A${r}`] ? String(sheet[`A${r}`].v).trim() : '';
    let valB = sheet[`B${r}`] ? String(sheet[`B${r}`].v).trim() : '';
    let valC = sheet[`C${r}`] ? String(sheet[`C${r}`].v).trim() : '';
    let valD = sheet[`D${r}`] ? String(sheet[`D${r}`].v).trim() : '';
    
    // Fix for dates being parsed as serial numbers in Excel
    if (valA === '45505' || valA === '45505.00') {
        valA = '1.8';
        valB = 'Hubungan Kerja yang Baik dengan Instansi Pemerintah Terkait';
    } else if (valA === '45507' || valA === '45507.00') {
        valA = '3.8';
        valB = 'Pencatatan yang Akurat dan Tepat Waktu atas Transaksi dan Kejadian';
    } else if (valA === '45538' || valA === '45538.00') {
        valA = '3.9';
        valB = 'Pembatasan Akses atas Sumber Daya dan Pencatatannya';
    }

    if (valA && valB) {
        currentSub = {
            code: valA,
            name: valB,
            type: 'SPIP',
            indicators: []
        };
        subElements.push(currentSub);
        console.log(`Found sub-element ${valA}: ${valB}`);
    }

    if (valC && valD) {
        const indicatorNum = parseInt(valC);
        const indicator = {
            number: indicatorNum,
            name: valD,
            grades: []
        };
        
        // Read 5 grades (A-E)
        for (let g = 0; g < 5; g++) {
            const rowIdx = r + g;
            const gradeVal = sheet[`H${rowIdx}`] ? String(sheet[`H${rowIdx}`].v).trim() : '';
            const criteriaVal = sheet[`I${rowIdx}`] ? String(sheet[`I${rowIdx}`].v).trim() : '';
            const explanationVal = sheet[`J${rowIdx}`] ? String(sheet[`J${rowIdx}`].v).trim() : '';
            const testMethodVal = sheet[`K${rowIdx}`] ? String(sheet[`K${rowIdx}`].v).trim() : '';
            
            if (gradeVal) {
                indicator.grades.push({
                    grade: gradeVal,
                    criteria: criteriaVal,
                    explanation: explanationVal,
                    testing_method: testMethodVal
                });
            }
        }
        
        if (currentSub) {
            currentSub.indicators.push(indicator);
        }
        
        r += 4; // Skip the grade rows we just read
    }
}

const data = {
    opds,
    sub_elements: subElements
};

const outputPath = path.join(__dirname, '../database/seeders/spip_data.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully exported spip_data.json to:', outputPath);
