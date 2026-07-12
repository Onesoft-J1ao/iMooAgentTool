const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'build-clean.js');
let c = fs.readFileSync(file, 'utf8');

// The corrupted Chinese text in the agent addon
// Replace it with clean English text
c = c.replace(
  'content: "??? iMooAgentTool ???????????????????\\n" + featureList + "\\n??????????????? JSON ??? [{path, name, description, confidence (0-100), explanation}]?????markdown???????????[]?? },',
  'content: "You are a feature finder for iMooAgentTool. Available:\\n" + featureList + "\\nRespond with JSON array [{path, name, description, confidence (0-100), explanation}]. No markdown. If none return [].",'
);

// Also fix any Chinese in chat system prompt
c = c.replace(
  'content: "You are a helpful assistant for iMooDesktop smartwatch toolbox. Be concise and helpful."',
  'content: "You are a helpful assistant for iMooAgentTool smartwatch toolbox. Be concise and helpful."'
);

fs.writeFileSync(file, c, 'utf8');
console.log('Fixed corrupted text in build-clean.js');
