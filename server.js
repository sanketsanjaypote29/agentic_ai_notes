const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.mhtml': 'multipart/related',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
    let filePath = decodeURIComponent(req.url === '/' ? '/index.html' : req.url);
    // Remove query strings
    filePath = filePath.split('?')[0];

    const fullPath = path.join(BASE_DIR, filePath);

    // Security: prevent directory traversal
    if (!fullPath.startsWith(BASE_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
        }

        const ext = path.extname(fullPath).toLowerCase();
        const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
        const fileName = path.basename(fullPath);

        const baseHeaders = {
            'Content-Type': mimeType,
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*',
            'X-Frame-Options': 'SAMEORIGIN',
            'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
        };

        const range = req.headers.range;
        if (range && range.startsWith('bytes=')) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

            if (start >= stats.size || end >= stats.size || start > end) {
                res.writeHead(416, {
                    'Content-Range': `bytes */${stats.size}`,
                });
                return res.end();
            }

            const chunksize = (end - start) + 1;
            const fileStream = fs.createReadStream(fullPath, { start, end });
            res.writeHead(206, {
                ...baseHeaders,
                'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                'Content-Length': chunksize,
            });
            fileStream.pipe(res);
        } else {
            res.writeHead(200, {
                ...baseHeaders,
                'Content-Length': stats.size,
            });
            const stream = fs.createReadStream(fullPath);
            stream.pipe(res);
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════════════════╗`);
    console.log(`  ║   Agentic AI Notes Reader                       ║`);
    console.log(`  ║                                                  ║`);
    console.log(`  ║   → Open: http://localhost:${PORT}                  ║`);
    console.log(`  ║   → Press Ctrl+C to stop                        ║`);
    console.log(`  ╚══════════════════════════════════════════════════╝\n`);
});
