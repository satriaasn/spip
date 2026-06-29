const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, '../src/pages/Dashboard.jsx');
const lines = fs.readFileSync(dashPath, 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (line.includes('1.2') || line.includes('KKE_1.2') || line.includes('keterkaitan')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
