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
  /* Global reset for iframe embedding and smooth page scrolling */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    height: auto !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    background: #0b0d13 !important;
  }

  body {
    overflow: visible !important;
    overflow-y: auto !important;
  }

  /* Unconstrain fixed inset fullscreen containers saved by SingleFile from LMS */
  div[class*="fixed"][class*="inset-0"],
  .fixed.inset-0,
  div[class*="z-[1000]"],
  div.fixed {
    position: static !important;
    inset: auto !important;
    width: 100% !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
  }

  /* Hide LMS extraneous chrome, orbs, and exit fullscreen button */
  header, aside, .page-orb1, .page-orb2, [aria-label="Toggle Menu"],
  div[class*="@4xl:w-96"], [data-slot="accordion"],
  div[class*="justify-end"]:has(button),
  button:has(svg):has(path[d*="m14 10 7-7"]) {
    display: none !important;
  }

  /* Unconstrain nested height-locked containers and intermediate flex wrappers */
  main, .main, .page, .page-inner,
  [class*="h-screen"], [class*="overflow-hidden"], [class*="min-h-0"],
  [class*="h-full"], [class*="h-[calc(100vh-85px)]"],
  div[class*="overflow-auto"],
  div[class*="overflow-hidden"],
  div[class*="flex-col"] {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    position: static !important;
    flex: none !important;
    touch-action: auto !important;
    user-select: auto !important;
    -webkit-user-select: auto !important;
  }

  /* Make lecture title look clean and prominent at top */
  h2, h3 {
    text-align: center !important;
    color: #e2e8f0 !important;
    margin: 16px auto !important;
  }

  /* Center canvas document and allow natural full-height page scroll */
  .react-pdf__Document {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 28px !important;
    padding: 24px 12px 80px 12px !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    height: auto !important;
    min-height: auto !important;
    overflow: visible !important;
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

  @media (max-width: 600px) {
    .react-pdf__Document {
      padding: 12px 6px 60px 6px !important;
      gap: 16px !important;
    }
    .react-pdf__Page {
      border-radius: 6px !important;
    }
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
    
    // Remove inline overflow:hidden from <body>
    content = content.replace(/<body([^>]*?)style=["']?overflow:\s*hidden;?["']?/gi, '<body$1style="overflow-y:auto;overflow-x:hidden"');
    content = content.replace(/<body([^>]*?)style=overflow:hidden/gi, '<body$1style="overflow-y:auto;overflow-x:hidden"');

    // Also strip inline overflow:hidden if present anywhere in style attributes of body
    content = content.replace(/(<body[^>]*?style="[^"]*?)overflow:\s*hidden;?/gi, '$1overflow-y:auto;');

    // Inject overrideCSS right before </body> so it has the highest cascade specificity
    if (content.includes('</body>')) {
        content = content.replace('</body>', overrideCSS + '\n</body>');
    } else {
        // If no </body>, append to end of file
        content = content + '\n' + overrideCSS;
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    processed++;
    console.log(`Enhanced & Made Scrollable: ${file}`);
});

console.log(`\nSuccessfully fixed scrollability and styling for ${processed} class notes files.`);
