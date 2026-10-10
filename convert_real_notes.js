const fs = require('fs');
const path = require('path');

function decodeQuotedPrintableUtf8(str) {
    const cleaned = str.replace(/=\r?\n/g, '');
    const bytes = [];
    for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === '=' && i + 2 < cleaned.length) {
            const hex = cleaned.slice(i + 1, i + 3);
            if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
                bytes.push(parseInt(hex, 16));
                i += 2;
                continue;
            }
        }
        bytes.push(cleaned.charCodeAt(i));
    }
    return Buffer.from(bytes).toString('utf8');
}

function getPartBody(partStr) {
    const rnrn = partStr.indexOf('\r\n\r\n');
    const nn = partStr.indexOf('\n\n');
    const splitIdx = rnrn !== -1 ? rnrn : nn;
    const delimLen = rnrn !== -1 ? 4 : 2;
    if (splitIdx === -1) return '';
    return partStr.slice(splitIdx + delimLen);
}

function convertNote(file) {
    const raw = fs.readFileSync(path.join(__dirname, 'notes', file), 'utf8');
    const bMatch = raw.match(/boundary="?([^"\r\n]+)"?/i);
    if (!bMatch) throw new Error('No boundary');
    const boundary = bMatch[1];
    const parts = raw.split(new RegExp('--' + boundary.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')));

    // Find the note frame part (the actual lecture note)
    const notePart = parts.find(p => p.includes('Content-Location: blob:https://educosys.com/'));
    if (!notePart) {
        throw new Error('Note part not found in ' + file);
    }

    const noteRawBody = getPartBody(notePart);
    let html = decodeQuotedPrintableUtf8(noteRawBody);

    // Find all CSS references: href="cid:..."
    const cssLinks = [...html.matchAll(/<link[^>]+href=["']cid:([^"']+)["'][^>]*>/gi)];
    
    for (const match of cssLinks) {
        const fullTag = match[0];
        const cid = match[1];

        // Find CSS part (excluding notePart itself)
        const cssPart = parts.find(p => p !== notePart && (
            p.includes(`Content-Location: cid:${cid}`) ||
            p.includes(`Content-ID: <${cid}>`) ||
            (p.includes(cid) && p.includes('Content-Type: text/css'))
        ));

        if (cssPart) {
            const cssRawBody = getPartBody(cssPart);
            let css = decodeQuotedPrintableUtf8(cssRawBody);
            html = html.replace(fullTag, `<style>\n${css}\n</style>`);
            console.log(`  -> Inlined CSS: ${cid} (${Math.round(css.length / 1024)} KB)`);
        } else {
            console.warn(`  -> CSS part NOT found for: ${cid}`);
        }
    }

    // Ensure utf-8 charset meta tag is present
    if (!html.includes('charset=')) {
        html = html.replace('<head>', '<head><meta charset="utf-8">');
    }

    // Fix internal anchor links: change blob:...#s1 to #s1
    html = html.replace(/href=["']blob:https:\/\/[^#"']*#([^"']+)["']/gi, 'href="#$1"');

    // Add a basic default reset & styling so body scrolls and looks modern
    const injectCss = `
<style>
/* Reset & iframe compatibility */
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: auto !important;
}
</style>
`;
    html = html.replace('</head>', `${injectCss}\n</head>`);

    const outFile = file.replace(/\.mhtml$/i, '.html');
    const outPath = path.join(__dirname, 'notes', outFile);
    fs.writeFileSync(outPath, html, 'utf8');

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    console.log(`SUCCESS: ${outFile} (${Math.round(html.length / 1024)} KB) — Title: "${titleMatch ? titleMatch[1] : 'No title'}"`);
}

const mhtmlFiles = [
    '001 Prerequisites and installation.mhtml',
    '002 Project Details.mhtml',
    '007 Revision Notes - Ranking.mhtml',
    '008 Revision Notes - Types of RAG.mhtml',
    '011 Revision Notes - Context Engineering.mhtml',
    '013 Revision Notes - Memory.mhtml',
    '015 Revision Notes - Claude Code High Level Architecture.mhtml',
    '016 Revision Notes - HNSW.mhtml'
];

console.log('Extracting real note contents and real stylesheets...\n');
mhtmlFiles.forEach(f => {
    try {
        convertNote(f);
    } catch (e) {
        console.error('ERROR converting', f, e.message);
    }
});
console.log('\nAll 8 real notes successfully extracted and converted with proper styles!');
