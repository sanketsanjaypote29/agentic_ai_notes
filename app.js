/* ============================================
   Agentic AI Notes Reader — Application Logic
   ============================================ */

// ──────────────── DATA ────────────────
const NOTES_DATA = [
    {
        day: 1,
        title: "Intro to RAG",
        notes: [
            { name: "Prerequisites and Installation", file: "notes/001 Prerequisites and installation.html", type: "html" },
            { name: "Project Details", file: "notes/002 Project Details.html", type: "html" },
            { name: "Class Notes — Intro to RAG", file: "notes/003 Day 1 Class Notes - Intro to RAG.html", type: "html" }
        ]
    },
    {
        day: 2,
        title: "AST, Lexical, Hybrid, Agentic RAG",
        notes: [
            { name: "Class Notes — AST, Lexical, Hybrid, Agentic RAG", file: "notes/004 Day 2 Class Notes - AST, Lexical, Hybrid, Agentic RAG.html", type: "html" }
        ]
    },
    {
        day: 3,
        title: "Types of RAGs, Eval Metrics",
        notes: [
            { name: "Class Notes — Types of RAGs, Eval Metrics", file: "notes/005 Day 3 Class Notes - Types of RAGs, Eval Metrics.html", type: "html" },
            { name: "Revision Notes — RAG Eval Metrics", file: "notes/006 Revision Notes - RAG Eval Metrics.html", type: "html" },
            { name: "Revision Notes — Ranking", file: "notes/007 Revision Notes - Ranking.html", type: "html" },
            { name: "Revision Notes — Types of RAG", file: "notes/008 Revision Notes - Types of RAG.html", type: "html" }
        ]
    },
    {
        day: 4,
        title: "RAG Eval Comparison",
        notes: [
            { name: "Class Notes — RAG Eval Comparison", file: "notes/009 Day 4 Class Notes - RAG Eval Comparison.html", type: "html" }
        ]
    },
    {
        day: 5,
        title: "RAG Types, Context Engineering",
        notes: [
            { name: "Class Notes — RAG Types, Context Engineering", file: "notes/010 Day 5 Class Notes - RAG Types, Context Engineering.html", type: "html" },
            { name: "Revision Notes — Context Engineering", file: "notes/011 Revision Notes - Context Engineering.html", type: "html" }
        ]
    },
    {
        day: 6,
        title: "Memory",
        notes: [
            { name: "Class Notes — Memory", file: "notes/012 Day 6 Class Notes - Memory.html", type: "html" },
            { name: "Revision Notes — Memory", file: "notes/013 Revision Notes - Memory.html", type: "html" }
        ]
    },
    {
        day: 7,
        title: "Claude Code",
        notes: [
            { name: "Class Notes — Claude Code", file: "notes/014 Day 7 Class Notes - Claude Code.html", type: "html" },
            { name: "Revision Notes — Claude Code Architecture", file: "notes/015 Revision Notes - Claude Code High Level Architecture.html", type: "html" },
            { name: "Revision Notes — HNSW", file: "notes/016 Revision Notes - HNSW.html", type: "html" }
        ]
    },
    {
        day: 8,
        title: "Project, MCP",
        notes: []
    },
    {
        day: 9,
        title: "MCP, Skills, Long Running Tasks",
        notes: [
            { name: "Class Notes — MCP, Skills, Intro to Long Running Tasks", file: "notes/017_Day_9_Class_Notes_MCP,_Skills,_Intro_to_Long_Running_Tasks.html", type: "html" }
        ]
    },
    {
        day: 10,
        title: "Safety, Long Running Tasks",
        notes: [
            { name: "Memory in Agentic Apps", file: "notes/Memory in Agentic Apps.pdf", type: "pdf" },
            { name: "RAG — Agentic AI System Design Code", file: "notes/RAG - Agentic AI System Design Code.pdf", type: "pdf" }
        ]
    },
    {
        day: 11,
        title: "Capstone Project, MCP",
        notes: [
            { name: "Educosys Claude Capstone Project", file: "notes/Educosys Claude Capstone Project.pdf", type: "pdf" },
            { name: "MCP Guide", file: "notes/MCP.pdf", type: "pdf" }
        ]
    },
    {
        day: 12,
        title: "Continued Sessions",
        notes: []
    },
    {
        day: 13,
        title: "Reindexing, Caching, Scaling, Sharding",
        notes: [
            { name: "Class Notes — Reindexing, Caching, Scaling, Sharding", file: "notes/019_Class_Notes_Day_13_Reindexing,_Caching,_Scaling,_Sharding,_Multi.html", type: "html" }
        ]
    },
    {
        day: 14,
        title: "Interview Ques, LLMOps",
        notes: [
            { name: "Class Notes — Interview Questions, LLMOps", file: "notes/020 Class Notes - Day 14 - Interview Quess, LLMOps.html", type: "html" },
            { name: "Caching — Token Budgeting", file: "notes/Caching - Token Budgeting.html", type: "html" }
        ]
    },
    {
        day: 15,
        title: "Project Demos, Interview Discussion",
        notes: [
            { name: "Course Summary — Keerti Purswani", file: "notes/Keerti Purswani – Agentic AI System Design (Educosys).html", type: "html" },
            { name: "Week 5 — Agentic AI System Design", file: "notes/Week 5 - Agentic AI System Design.html", type: "html" }
        ]
    }
];

// ──────────────── STATE ────────────────
let currentNoteIndex = null; // flat index
let readNotes = JSON.parse(localStorage.getItem('agenticai_read_notes') || '{}');

// Build flat list of all notes with references
const flatNotes = [];
NOTES_DATA.forEach(day => {
    day.notes.forEach(note => {
        flatNotes.push({ ...note, day: day.day, dayTitle: day.title });
    });
});

// ──────────────── DOM REFS ────────────────
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('navList');
const searchInput = document.getElementById('searchInput');
const welcomeScreen = document.getElementById('welcomeScreen');
const contentViewer = document.getElementById('contentViewer');
const contentFrame = document.getElementById('contentFrame');
const loadingSpinner = document.getElementById('loadingSpinner');
const breadcrumbDay = document.getElementById('breadcrumbDay');
const breadcrumbTitle = document.getElementById('breadcrumbTitle');
const mobileTitle = document.getElementById('mobileTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const markReadBtn = document.getElementById('markReadBtn');
const openExternalBtn = document.getElementById('openExternalBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const downloadBtn = document.getElementById('downloadBtn');
const pdfNoticeBar = document.getElementById('pdfNoticeBar');
const pdfNoticeText = document.getElementById('pdfNoticeText');
const pdfDownloadLink = document.getElementById('pdfDownloadLink');
const pdfOpenNewTabLink = document.getElementById('pdfOpenNewTabLink');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const totalNotesEl = document.getElementById('totalNotes');
const quickLinks = document.getElementById('quickLinks');

// ──────────────── SAFE SPINNER HELPERS ────────────────
let loadingTimer = null;
function showLoading(maxMs = 1200) {
    if (loadingTimer) clearTimeout(loadingTimer);
    loadingSpinner.classList.add('visible');
    loadingTimer = setTimeout(() => {
        loadingSpinner.classList.remove('visible');
    }, maxMs);
}

function hideLoading() {
    if (loadingTimer) clearTimeout(loadingTimer);
    loadingSpinner.classList.remove('visible');
}

// ──────────────── FILE TYPE ICONS ────────────────
function getFileIcon(type) {
    const icons = {
        html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3L3.5 13L8 14.5L12.5 13L14 3H2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 6H11L10.5 10L8 11L5.5 10L5.3 8.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        mhtml: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M5 8H11M5 5.5H11M5 10.5H8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
        pdf: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2H10L13 5V14H4V2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 2V5H13" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M6.5 8H9.5M6.5 10.5H8.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
        txt: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`,
        docx: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="2" width="11" height="12" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 6L6.5 10L8 7L9.5 10L11 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };
    return icons[type] || icons.txt;
}

// ──────────────── RENDER SIDEBAR NAV ────────────────
function renderNav(filter = '') {
    navList.innerHTML = '';
    const lowerFilter = filter.toLowerCase();

    NOTES_DATA.forEach((dayData, dayIdx) => {
        const matchingNotes = dayData.notes.filter(n =>
            n.name.toLowerCase().includes(lowerFilter) ||
            dayData.title.toLowerCase().includes(lowerFilter) ||
            `day ${dayData.day}`.includes(lowerFilter)
        );

        if (filter && matchingNotes.length === 0) return;
        if (dayData.notes.length === 0 && !filter) {
            // Show empty days but greyed out
            const group = document.createElement('div');
            group.className = 'nav-day-group';
            group.innerHTML = `
                <div class="nav-day-header" style="opacity: 0.45; cursor: default;">
                    <span class="day-number">${dayData.day}</span>
                    <span class="day-title">Day ${dayData.day} — ${dayData.title}</span>
                    <span class="day-note-count" style="opacity: 0.5;">No notes</span>
                </div>
            `;
            navList.appendChild(group);
            return;
        }

        const group = document.createElement('div');
        group.className = 'nav-day-group';
        if (filter || isCurrentDay(dayData.day)) {
            group.classList.add('expanded');
        }

        const notesToShow = filter ? matchingNotes : dayData.notes;

        group.innerHTML = `
            <div class="nav-day-header" data-day="${dayData.day}">
                <span class="day-number">${dayData.day}</span>
                <span class="day-title">Day ${dayData.day} — ${dayData.title}</span>
                <span class="day-note-count">${notesToShow.length}</span>
                <svg class="day-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="nav-items">
                ${notesToShow.map(note => {
                    const flatIdx = flatNotes.findIndex(fn => fn.file === note.file);
                    const isRead = readNotes[note.file];
                    const isActive = currentNoteIndex === flatIdx;
                    return `
                        <div class="nav-item ${isActive ? 'active' : ''}" data-index="${flatIdx}">
                            <span class="nav-item-icon ${note.type}-icon">${getFileIcon(note.type)}</span>
                            <span class="nav-item-text" title="${note.name}">${note.name}</span>
                            ${isRead ? '<span class="nav-item-badge read">✓</span>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        navList.appendChild(group);
    });

    // Attach event listeners
    document.querySelectorAll('.nav-day-header[data-day]').forEach(header => {
        header.addEventListener('click', () => {
            const group = header.closest('.nav-day-group');
            group.classList.toggle('expanded');
        });
    });

    document.querySelectorAll('.nav-item[data-index]').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            loadNote(idx);
        });
    });
}

function isCurrentDay(day) {
    if (currentNoteIndex === null) return false;
    return flatNotes[currentNoteIndex]?.day === day;
}

// ──────────────── LOAD NOTE ────────────────
function loadNote(index) {
    if (index < 0 || index >= flatNotes.length) return;

    currentNoteIndex = index;
    const note = flatNotes[index];

    // Update UI
    welcomeScreen.style.display = 'none';
    contentViewer.style.display = 'flex';

    // Show loading with safeguard
    showLoading(note.type === 'pdf' ? 250 : 1200);

    // Breadcrumb
    breadcrumbDay.textContent = `Day ${note.day}`;
    breadcrumbTitle.textContent = note.name;
    mobileTitle.textContent = note.name;

    // Update mark read button
    updateMarkReadBtn();

    // Reset PDF notice bar
    if (pdfNoticeBar) pdfNoticeBar.style.display = 'none';

    // Load content
    if (note.type === 'pdf') {
        // PDF Document: Show notice bar and embed with PDF parameters
        if (pdfNoticeBar) {
            pdfNoticeBar.style.display = 'flex';
            if (pdfNoticeText) pdfNoticeText.textContent = `${note.name} (Day ${note.day})`;
            if (pdfDownloadLink) {
                pdfDownloadLink.href = note.file;
                pdfDownloadLink.setAttribute('download', note.file.split('/').pop());
            }
            if (pdfOpenNewTabLink) {
                pdfOpenNewTabLink.href = note.file;
            }
        }
        // Chromium's built-in PDF viewer plugin does not fire standard iframe onload events.
        // We ensure the loading spinner is dismissed quickly so the PDF is immediately visible.
        setTimeout(hideLoading, 250);
        contentFrame.onload = hideLoading;
        contentFrame.src = `${note.file}#toolbar=1&navpanes=0`;
    } else if (note.type === 'txt') {
        // For text files, fetch and display in a styled wrapper
        fetch(note.file)
            .then(res => res.text())
            .then(text => {
                const doc = contentFrame.contentDocument || contentFrame.contentWindow.document;
                doc.open();
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            body {
                                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                                background: #0f0f17;
                                color: #e0e0e8;
                                padding: 40px;
                                line-height: 1.8;
                                font-size: 15px;
                                max-width: 800px;
                                margin: 0 auto;
                            }
                            pre {
                                white-space: pre-wrap;
                                word-wrap: break-word;
                                font-family: 'JetBrains Mono', monospace;
                                background: #18181f;
                                padding: 24px;
                                border-radius: 12px;
                                border: 1px solid rgba(255,255,255,0.08);
                                color: #c7d2fe;
                            }
                        </style>
                    </head>
                    <body><pre>${escapeHtml(text)}</pre></body>
                    </html>
                `);
                doc.close();
                hideLoading();
            })
            .catch(() => {
                showError(note);
            });
    } else if (note.type === 'docx') {
        // For docx, show a message with download link
        const doc = contentFrame.contentDocument || contentFrame.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background: #0f0f17;
                        color: #e0e0e8;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                        padding: 40px;
                    }
                    .icon {
                        width: 64px;
                        height: 64px;
                        background: rgba(59, 130, 246, 0.15);
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px;
                        font-size: 28px;
                    }
                    h2 {
                        font-size: 1.3rem;
                        margin-bottom: 8px;
                        color: #a5b4fc;
                    }
                    p {
                        color: #9495a8;
                        margin-bottom: 20px;
                        font-size: 0.9rem;
                    }
                    a {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 24px;
                        background: linear-gradient(135deg, #6366f1, #8b5cf6);
                        color: white;
                        text-decoration: none;
                        border-radius: 10px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        transition: transform 0.2s, box-shadow 0.2s;
                    }
                    a:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">📄</div>
                    <h2>${note.name}</h2>
                    <p>This is a Word document (.docx). Click below to download and open it in Microsoft Word or Google Docs.</p>
                    <a href="${note.file}" download>⬇ Download Document</a>
                </div>
            </body>
            </html>
        `);
        doc.close();
        hideLoading();
    } else {
        // HTML, MHTML — load directly in iframe with safety timer
        contentFrame.onload = hideLoading;
        contentFrame.src = note.file;
    }

    // Update nav highlight
    renderNav(searchInput.value);

    // Expand the current day group
    setTimeout(() => {
        const dayGroups = document.querySelectorAll('.nav-day-group');
        dayGroups.forEach(g => {
            const header = g.querySelector('.nav-day-header');
            if (header && parseInt(header.dataset.day) === note.day) {
                g.classList.add('expanded');
            }
        });
    }, 50);

    // Close mobile sidebar
    closeSidebar();

    // Update prev/next buttons
    updateNavButtons();
}

function showError(note) {
    const doc = contentFrame.contentDocument || contentFrame.contentWindow.document;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Inter', sans-serif;
                    background: #0f0f17;
                    color: #e0e0e8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                h2 { color: #f87171; margin-bottom: 8px; }
                p { color: #9495a8; }
            </style>
        </head>
        <body>
            <div>
                <h2>Unable to load</h2>
                <p>Could not load "${note.name}". The file may not be accessible.</p>
            </div>
        </body>
        </html>
    `);
    doc.close();
    loadingSpinner.classList.remove('visible');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ──────────────── NAV BUTTONS ────────────────
function updateNavButtons() {
    prevBtn.disabled = currentNoteIndex <= 0;
    nextBtn.disabled = currentNoteIndex >= flatNotes.length - 1;
    prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
}

prevBtn.addEventListener('click', () => {
    if (currentNoteIndex > 0) loadNote(currentNoteIndex - 1);
});

nextBtn.addEventListener('click', () => {
    if (currentNoteIndex < flatNotes.length - 1) loadNote(currentNoteIndex + 1);
});

// ──────────────── MARK READ ────────────────
function updateMarkReadBtn() {
    if (currentNoteIndex === null) return;
    const note = flatNotes[currentNoteIndex];
    const isRead = readNotes[note.file];
    markReadBtn.classList.toggle('read-active', !!isRead);
    markReadBtn.querySelector('.btn-label').textContent = isRead ? 'Read ✓' : 'Mark Read';
}

markReadBtn.addEventListener('click', () => {
    if (currentNoteIndex === null) return;
    const note = flatNotes[currentNoteIndex];
    if (readNotes[note.file]) {
        delete readNotes[note.file];
    } else {
        readNotes[note.file] = true;
    }
    localStorage.setItem('agenticai_read_notes', JSON.stringify(readNotes));
    updateMarkReadBtn();
    updateProgress();
    renderNav(searchInput.value);
});

// ──────────────── PROGRESS ────────────────
function updateProgress() {
    const total = flatNotes.length;
    const read = Object.keys(readNotes).length;
    const percent = total > 0 ? Math.round((read / total) * 100) : 0;
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
}

// ──────────────── OPEN EXTERNAL & DOWNLOAD ────────────────
openExternalBtn.addEventListener('click', () => {
    if (currentNoteIndex === null) return;
    window.open(flatNotes[currentNoteIndex].file, '_blank');
});

if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        if (currentNoteIndex === null) return;
        const note = flatNotes[currentNoteIndex];
        const a = document.createElement('a');
        a.href = note.file;
        a.download = note.file.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

// ──────────────── FULLSCREEN ────────────────
fullscreenBtn.addEventListener('click', () => {
    document.body.classList.toggle('fullscreen-mode');
});

// ──────────────── SEARCH ────────────────
searchInput.addEventListener('input', (e) => {
    renderNav(e.target.value);
});

// ──────────────── SIDEBAR TOGGLE ────────────────
function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
    document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openSidebar);
sidebarToggle.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// ──────────────── KEYBOARD SHORTCUTS ────────────────
document.addEventListener('keydown', (e) => {
    // Arrow keys for navigation
    if (e.key === 'ArrowLeft' && !e.target.matches('input')) {
        if (currentNoteIndex > 0) loadNote(currentNoteIndex - 1);
    }
    if (e.key === 'ArrowRight' && !e.target.matches('input')) {
        if (currentNoteIndex < flatNotes.length - 1) loadNote(currentNoteIndex + 1);
    }
    // Ctrl+K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    // Escape to close sidebar
    if (e.key === 'Escape') {
        closeSidebar();
        if (document.body.classList.contains('fullscreen-mode')) {
            document.body.classList.remove('fullscreen-mode');
        }
    }
});

// ──────────────── QUICK LINKS ────────────────
function renderQuickLinks() {
    // Show the first note of each day that has notes (max 6)
    const links = NOTES_DATA
        .filter(d => d.notes.length > 0)
        .slice(0, 6)
        .map(d => {
            const firstNote = d.notes[0];
            const flatIdx = flatNotes.findIndex(fn => fn.file === firstNote.file);
            return `
                <div class="quick-link" data-index="${flatIdx}">
                    <span class="quick-link-day">Day ${d.day}</span>
                    <span class="quick-link-title">${d.title}</span>
                </div>
            `;
        });

    quickLinks.innerHTML = links.join('');

    document.querySelectorAll('.quick-link[data-index]').forEach(link => {
        link.addEventListener('click', () => {
            loadNote(parseInt(link.dataset.index));
        });
    });
}

// ──────────────── INIT ────────────────
function init() {
    totalNotesEl.textContent = flatNotes.length;
    renderNav();
    renderQuickLinks();
    updateProgress();
}

init();