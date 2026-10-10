const fs = require('fs');
const path = require('path');

const notesDir = path.join(__dirname, 'notes');
const singleFileNotes = [
    '003 Day 1 Class Notes - Intro to RAG.html',
    '004 Day 2 Class Notes - AST, Lexical, Hybrid, Agentic RAG.html',
    '005 Day 3 Class Notes - Types of RAGs, Eval Metrics.html',
    '009 Day 4 Class Notes - RAG Eval Comparison.html',
    '010 Day 5 Class Notes - RAG Types, Context Engineering.html',
    '012 Day 6 Class Notes - Memory.html',
    '014 Day 7 Class Notes - Claude Code.html',
    '017_Day_9_Class_Notes_MCP,_Skills,_Intro_to_Long_Running_Tasks.html',
    '019_Class_Notes_Day_13_Reindexing,_Caching,_Scaling,_Sharding,_Multi.html',
    '020 Class Notes - Day 14 - Interview Quess, LLMOps.html'
];

const overrideCSS = `
<style id="notes-reader-clean-viewer">
  /* Global reset for iframe embedding */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    height: auto !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    background: #0b0d13 !important;
  }

  /* Hide LMS extraneous chrome that clutters iframe */
  header, aside, .page-orb1, .page-orb2, [aria-label="Toggle Menu"],
  div[class*="@4xl:w-96"], [data-slot="accordion"] {
    display: none !important;
  }

  /* Unconstrain nested height-locked containers */
  main, .main, .page, .page-inner,
  [class*="h-screen"], [class*="overflow-hidden"], [class*="min-h-0"],
  [class*="h-[calc(100vh-85px)]"] {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    position: static !important;
  }

  /* Make lecture title look clean and prominent at top */
  h2, h3 {
    text-align: center !important;
    color: #e2e8f0 !important;
    margin: 16px auto !important;
  }

  /* Center canvas document */
  .react-pdf__Document {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 24px !important;
    padding: 20px 10px 60px 10px !important;
    width: 100% !important;
  }

  /* Individual slide cards */
  .react-pdf__Page {
    width: 100% !important;
    max-width: 900px !important;
    height: auto !important;
    min-height: auto !important;
    margin: 0 auto !important;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6) !important;
    border-radius: 10px !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    background: #ffffff !important;
  }

  /* Canvas responsiveness inside slide */
  .react-pdf__Page canvas, .react-pdf__Page__canvas {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
  }
</style>
`;

let processed = 0;
singleFileNotes.forEach(file => {
    const fullPath = path.join(notesDir, file);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove previous injection if any
    content = content.replace(/<style id="notes-reader-clean-viewer">[\s\S]*?<\/style>/gi, '');
    
    // Inject before </head>
    if (content.includes('</head>')) {
        content = content.replace('</head>', overrideCSS + '\n</head>');
    } else {
        content = overrideCSS + content;
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    processed++;
    console.log(`Enhanced: ${file}`);
});

console.log(`\nSuccessfully applied clean viewer overrides to ${processed} class notes.`);
