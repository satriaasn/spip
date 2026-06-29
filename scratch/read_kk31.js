const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['KK3.1'];

if (!sheet) {
    console.log('KK3.1 not found');
} else {
    console.log('KK3.1 range:', sheet['!ref']);
    // Check some cells in column RX, e.g., RX202, RX223
    const cellsToCheck = ['RX202', 'RX207', 'RX212', 'RX217', 'RX223', 'RX224', 'RX229', 'RX234', 'RX239', 'RX240', 'RX245'];
    cellsToCheck.forEach(cellAddress => {
        const cell = sheet[cellAddress];
        if (cell) {
            console.log(`${cellAddress}: Value = ${cell.v} | Formula = ${cell.f || 'None'}`);
        } else {
            console.log(`${cellAddress}: empty`);
        }
    });
}
