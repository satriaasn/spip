const fs = require('fs');
const path = require('path');

const pathPohon = path.join(__dirname, '../src/pages/PohonKinerja.jsx');
const lines = fs.readFileSync(pathPohon, 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (line.includes('function') || line.includes('const') && line.includes('=>') && (line.includes('save') || line.includes('add') || line.includes('insert') || line.includes('submit') || line.includes('Kke'))) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
