const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, '../src/pages/Dashboard.jsx');
const lines = fs.readFileSync(dashPath, 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (line.includes('from') || line.includes('achievement') || line.includes('KK5')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
