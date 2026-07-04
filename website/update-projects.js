// ===========================================
// 硬件作品集 - 项目数据更新脚本
// 用法: node website/update-projects.js
// ===========================================
const fs = require('fs');
const path = require('path');

const rootDir = '个人项目合集';
const outputFile = 'website/js/projects-data.js';
const output = { projects: [], categories: [] };

function scanDir(dir, category) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const subdirs = items.filter(i => i.isDirectory());
  const files = items.filter(i => i.isFile());
  
  if (subdirs.length === 0 && files.length > 0) {
    const projectName = path.basename(dir);
    const images = files.filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name)).map(f => path.join(dir, f.name));
    const pdfs = files.filter(f => /\.pdf$/i.test(f.name)).map(f => path.join(dir, f.name));
    const mdFiles = files.filter(f => /\.md$/i.test(f.name)).map(f => path.join(dir, f.name));
    const schPdfs = pdfs.filter(f => /SCH/i.test(f));
    const pcbPdfs = pdfs.filter(f => /PCB/i.test(f));
    const otherPdfs = pdfs.filter(f => !/SCH|PCB/i.test(f));
    
    output.projects.push({
      name: projectName,
      path: dir,
      category: category,
      images: images,
      schPdf: schPdfs,
      pcbPdf: pcbPdfs,
      otherPdf: otherPdfs,
      docFiles: mdFiles,
      has3d: images.some(i => /3D/i.test(i))
    });
    console.log('  [' + category + '] ' + projectName);
    return;
  }
  for (const sub of subdirs) {
    scanDir(path.join(dir, sub.name), category);
  }
}

console.log('=== 扫描项目目录 ===\n');
const entries = fs.readdirSync(rootDir, { withFileTypes: true });
const topDirs = entries.filter(e => e.isDirectory());
for (const dir of topDirs) {
  output.categories.push({ name: dir.name, path: path.join(rootDir, dir.name) });
  scanDir(path.join(rootDir, dir.name), dir.name);
}

const jsContent = '// Auto-generated - Run: node website/update-projects.js\n\nconst PROJECTS_DATA = ' +
  JSON.stringify(output, null, 2) + ';\n';

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, jsContent, 'utf-8');

console.log('\n=== 完成 ===');
console.log('共 ' + output.projects.length + ' 个项目');
console.log('分类: ' + output.categories.map(c => c.name).join(', '));
console.log('数据已写入: ' + outputFile);
