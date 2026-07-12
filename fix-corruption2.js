const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'build-clean.js');
let c = fs.readFileSync(file, 'utf8');

// Find the exact corrupted string by looking for 'featureList' in the agent addon
let idx1 = c.indexOf('"\\n" + featureList + "\\n"');
if (idx1 >= 0) {
  // Find the start of this line (the content field)
  let lineStart = c.lastIndexOf('\n', idx1);
  let lineEnd = c.indexOf('\n', idx1);
  let corruptedLine = c.slice(lineStart, lineEnd);
  console.log('Found corrupted line:', corruptedLine.slice(0, 150));
  
  // Build a clean replacement
  let cleanLine = `              { role: "system", content: "You are a feature finder for iMooAgentTool. Available features:\\n" + featureList + "\\nAnalyze the user query and respond with JSON array [{path, name, description, confidence (0-100), explanation}]. No markdown. If no match return [].",`;
  
  c = c.slice(0, lineStart) + '\n' + cleanLine + c.slice(lineEnd);
  console.log('Fixed agent search system prompt');
}

// Also fix the chat system prompt
let idx2 = c.indexOf('iMooDesktop smartwatch toolbox');
if (idx2 >= 0) {
  c = c.slice(0, idx2) + 'iMooAgentTool smartwatch' + c.slice(idx2 + 'iMooDesktop smartwatch'.length);
  console.log('Fixed chat system prompt');
}

// Also fix any other iMooDesktop references in the agent addon
c = c.split('iMooDesktop').join('iMooAgentTool');

fs.writeFileSync(file, c, 'utf8');
console.log('Done fixing');
