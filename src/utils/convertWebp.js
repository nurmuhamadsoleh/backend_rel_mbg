const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertToWebp(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.webp') {
    return filePath;
  }

  const outputPath = filePath.replace(ext, '.webp');

  await sharp(filePath)
    .webp({ quality: 80 })
    .toFile(outputPath);

  fs.unlinkSync(filePath);

  return outputPath;
}

module.exports = convertToWebp;
