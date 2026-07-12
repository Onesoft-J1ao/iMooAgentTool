const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const asarPath = path.join(__dirname, 'resources', 'app.asar');
if (fs.existsSync(asarPath)) {
  require(asarPath);
} else {
  console.error('app.asar not found at', asarPath);
  app.quit();
}