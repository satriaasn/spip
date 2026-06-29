const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('Scanning all sub-elements and indicators in KK3.1:');
    let currentSubCode = '';
    let currentSubName = '';
    
    for (let r = 10; r <= 350; r++) {
        const valA = sheet[`A${r}`] ? sheet[`A${r}`].v : '';
        const valB = sheet[`B${r}`] ? sheet[`B${r}`].v : '';
        const valC = sheet[`C${r}`] ? sheet[`C${r}`].v : '';
        const valD = sheet[`D${r}`] ? sheet[`D${r}`].v : '';
        
        if (valA && valB) {
            currentSubCode = valA;
            currentSubName = valB;
            console.log(`\nSub-Element ${currentSubCode}: ${currentSubName}`);
        }
        
        if (valC && valD) {
            // Row has an indicator number and text
            // Check the grades listed in subsequent rows
            const grades = [];
            for (let g = 0; g < 5; g++) {
                const gradeRow = r + g;
                const gradeVal = sheet[`H${gradeRow}`] ? sheet[`H${gradeRow}`].v : '';
                const criteriaVal = sheet[`I${gradeRow}`] ? sheet[`I${gradeRow}`].v : '';
                if (gradeVal) {
                    grades.push({ grade: gradeVal, criteria: criteriaVal });
                }
            }
            console.log(`  Indicator ${valC}: "${valD.substring(0, 80)}..."`);
            grades.forEach(g => {
                console.log(`    - Grade ${g.grade}: ${String(g.criteria).substring(0, 80)}...`);
            });
            r += 4; // Skip the grade rows since we processed them
        }
    }
}
