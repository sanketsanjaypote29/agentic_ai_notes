# Agentic AI Notes Reader 📚

An interactive, user-friendly web reader and local streaming server for all **Agentic AI System Design** course notes (Days 1–15). 

Includes lecture slides, standalone revision notes, system architecture diagrams, and PDF resources with zero manual uploads needed.

---

## ✨ Features

- **26 Curated Course Notes:** Covering all days of the curriculum (Intro to RAG, AST/Lexical/Hybrid RAG, RAG Evaluation Metrics, Ranking, Context Engineering, Memory, Claude Code Architecture, HNSW, MCP, LLMOps, and Capstone Projects).
- **Standalone HTML Revision Notes:** High-performance, beautifully styled dark-theme revision notes with mathematical formulas, diagrams, and code snippets.
- **Responsive Slide Viewer:** Automatically resizes and centers multi-page lecture slide canvases for optimal reading across desktop and mobile screens.
- **Embedded PDF Support:** Streamlined PDF viewer with direct *"Open in Full Tab"* and *"Download PDF"* integration.
- **Real-Time Search & Filtering:** Filter notes by title, topic, or lecture day instantly.
- **Reading Progress Tracking:** Saves completion progress locally in your browser (`localStorage`).
- **One-Click Local Server:** Includes a lightweight Node.js streaming server with HTTP Range Request support for seamless PDF streaming.

---

## 🚀 Getting Started

### Method 1: Using `start.bat` (Windows)
Simply double-click:
```cmd
start.bat
```
This automatically starts the local HTTP server and opens `http://localhost:3000` in your default browser.

### Method 2: Command Line
```bash
# Start the local server
node server.js
```
Then navigate to:
```
http://localhost:3000
```

---

## 📂 Project Structure

```text
agentic_ai_notes/
├── index.html                 # Main application shell
├── styles.css                 # Dark theme, glassmorphism design system
├── app.js                     # Dynamic note loader, search & reading progress logic
├── server.js                  # Lightweight Node.js server with HTTP range & CORS support
├── start.bat                  # One-click Windows runner
├── package.json               # NPM configuration
├── audit_all_notes.js         # Integrity audit tool for all notes
├── convert_real_notes.js      # Utility script for MHTML-to-HTML conversion
├── sanitize_class_notes.js    # Utility script for responsive canvas styling
└── notes/                     # Course notes (HTML, PDF, DOCX, TXT)
```

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3 (Modern Dark Theme, Glassmorphism), Modern JavaScript (ES6+)
- **Server:** Node.js built-in HTTP module (`http`, `fs`, `path`, `url`) with byte-range streaming
- **Storage:** Client-side `localStorage` for progress persistence
