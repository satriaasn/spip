const fs = require('fs');
const path = require('path');

const pathPohon = path.join(__dirname, '../src/pages/PohonKinerja.jsx');
const lines = fs.readFileSync(pathPohon, 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (line.includes('titleObjective') || line.includes('parent_id') || line.includes('isAdding')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
