const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _Pembahasan terakhir.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('Reading Block 0 (DISPUSIP) from KK3.1:');
    
    let currentSubCode = '';
    
    for (let r = 10; r <= 260; r++) {
        const valA = sheet[`A${r}`] ? String(sheet[`A${r}`].v).trim() : '';
        const valC = sheet[`C${r}`] ? String(sheet[`C${r}`].v).trim() : '';
        
        if (valA) {
            currentSubCode = valA;
        }
        
        if (valC) {
            const paramNo = parseInt(valC);
            const grade = sheet[`M${r}`] ? String(sheet[`M${r}`].v).trim() : '';
            
            if (grade) {
                // Determine target row based on grade
                const offset = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 }[grade] || 0;
                const uraianRow = r + offset;
                const uraian = sheet[`R${uraianRow}`] ? String(sheet[`R${uraianRow}`].v).trim() : '';
                
                const aoiCluster = sheet[`N${r}`] ? String(sheet[`N${r}`].v).trim() : '';
                const aoiDesc = sheet[`O${r}`] ? String(sheet[`O${r}`].v).trim() : '';
                const causeCluster = sheet[`P${r}`] ? String(sheet[`P${r}`].v).trim() : '';
                const causeDesc = sheet[`Q${r}`] ? String(sheet[`Q${r}`].v).trim() : '';

                console.log(`Sub: ${currentSubCode} | Param: ${paramNo} | Grade: ${grade}`);
                console.log(`  Uraian: ${uraian.substring(0, 100)}...`);
                if (aoiCluster) console.log(`  AoI Cluster: ${aoiCluster}`);
                if (causeCluster) console.log(`  Cause Cluster: ${causeCluster}`);
            }
            
            r += 4; // Skip the other 4 rows of the block
        }
    }
}
