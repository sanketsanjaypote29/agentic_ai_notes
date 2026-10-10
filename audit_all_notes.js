const fs = require('fs');
const path = require('path');

// Read app.js to get NOTES_DATA
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

// Extract all note files from NOTES_DATA
const matches = [...appJs.matchAll(/{\s*name:\s*"([^"]+)",\s*file:\s*"([^"]+)",\s*type:\s*"([^"]+)"/g)];
console.log(`Found ${matches.length} notes defined in app.js.\n`);

const results = [];

matches.forEach((m, idx) => {
    const name = m[1];
    const relFile = m[2];
    const type = m[3];
    const fullPath = path.join(__dirname, relFile);
    
    if (!fs.existsSync(fullPath)) {
        console.error(`[ERROR] File missing on disk: ${relFile}`);
        results.push({ idx: idx + 1, name, file: relFile, status: 'MISSING' });
        return;
    }
    
    const stats = fs.statSync(fullPath);
    const sizeKB = Math.round(stats.size / 1024);
    
    if (type === 'pdf') {
        results.push({ idx: idx + 1, name, file: relFile, type, sizeKB, status: 'PDF_OK' });
        return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if it contains unresolvable iframes or cid links
    const hasCid = content.includes('cid:');
    const hasIframe = /<iframe[^>]+src=["'](cid:|blob:)/i.test(content);
    const hasBody = content.includes('<body');
    const hasOverflowHidden = /body[^>]*overflow:\s*hidden/i.test(content) || /style="[^"]*overflow:\s*hidden/i.test(content);
    
    // Extract plain text snippet from body
    let bodyText = '';
    const bodyIdx = content.indexOf('<body');
    if (bodyIdx !== -1) {
        bodyText = content.slice(bodyIdx)
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
    
    const snippet = bodyText.slice(0, 100);
    const textLength = bodyText.length;
    
    results.push({
        idx: idx + 1,
        name,
        file: relFile,
        type,
        sizeKB,
        textLength,
        hasCid,
        hasIframe,
        hasOverflowHidden,
        snippet,
        status: (textLength > 100 && !hasCid && !hasIframe) ? 'OK' : 'NEEDS_ATTENTION'
    });
});

console.table(results.map(r => ({
    idx: r.idx,
    file: path.basename(r.file),
    type: r.type,
    sizeKB: r.sizeKB,
    textLen: r.textLength || 0,
    hasCid: r.hasCid,
    hasIframe: r.hasIframe,
    snippet: (r.snippet || '').slice(0, 40),
    status: r.status
})));
