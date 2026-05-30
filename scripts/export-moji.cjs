// Export 墨记 diary entries to Obsidian Markdown files
// Usage: node scripts/export-moji.cjs

const initSqlJs = require('sql.js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DB_PATH = 'C:/Users/75815/AppData/Roaming/com.denglin.mojipc/bat/mjd.db';
const IMG_SRC = 'C:/Users/75815/AppData/Roaming/com.denglin.mojipc/cs';
const OUT_DIR = 'D:/杂物/obsidian/cangku/大虾/moji';
const IMG_OUT = path.join(OUT_DIR, 'images');

const AES_KEY = '[Lin].Ke18(moji)';
const AES_IV = 'Lin2017K0426MOJI';

function aesDecrypt(encryptedBase64) {
  if (!encryptedBase64) return '';
  try {
    const clean = encryptedBase64.replace(/\n/g, '');
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(AES_KEY, 'utf-8'), Buffer.from(AES_IV, 'utf-8'));
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(clean, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  } catch (e) {
    return null;
  }
}

(async () => {
  const SQL = await initSqlJs();
  const buf = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(buf);

  const diaries = db.exec('SELECT content, contentQuery, text, writeDate FROM Diary WHERE isDelete = 0 ORDER BY writeDate ASC');
  if (!diaries[0]) { console.log('No diaries found'); return; }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(IMG_OUT, { recursive: true });

  const { columns, values } = diaries[0];
  console.log(`Total diaries: ${values.length}`);

  let exported = 0, imagesCopied = 0;
  for (const row of values) {
    const record = {};
    columns.forEach((col, i) => { record[col] = row[i]; });

    const rawDate = record.writeDate || '';
    if (!rawDate) continue;

    const dateStr = rawDate.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1-$2-$3 $4:$5');
    const datePart = dateStr.slice(0, 10);

    // Process content sections
    const contentJson = record.content || '';
    let fullText = '';

    if (contentJson.startsWith('[{')) {
      try {
        const sections = JSON.parse(contentJson);
        const parts = [];

        for (const s of sections) {
          if (s.T) {
            const decrypted = aesDecrypt(s.T);
            if (decrypted !== null) {
              parts.push(decrypted);
            }
          } else if (s.F) {
            // Image section — copy image and insert Obsidian link
            const srcPath = path.join(IMG_SRC, s.F);
            const destPath = path.join(IMG_OUT, s.F);
            if (fs.existsSync(srcPath)) {
              try {
                fs.copyFileSync(srcPath, destPath);
                imagesCopied++;
              } catch {}
            }
            parts.push(`\n![[images/${s.F}]]\n`);
          }
        }

        fullText = parts.join('');
      } catch {}
    }

    if (!fullText) {
      fullText = (record.contentQuery || record.text || '').trim();
    }
    if (!fullText.trim()) continue;

    // Title from first non-empty line
    const lines = fullText.split('\n').filter(l => l.trim() && !l.startsWith('![['));
    const firstLine = lines[0] || '';
    const title = firstLine.replace(/^#+\s*/, '').trim().slice(0, 50) || dateStr;

    const safeTitle = title.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, ' ').trim();
    let filename = `${datePart}-${safeTitle}.md`;
    if (filename.length > 120) filename = filename.slice(0, 117) + '.md';

    const outPath = path.join(OUT_DIR, filename);
    // Remove the title line and weather line from body to avoid duplication
    let body = fullText;
    if (firstLine) {
      body = body.slice(body.indexOf(firstLine) + firstLine.length);
    }
    // Also strip weather/heartbeat prefix lines
    body = body.replace(/^\n*天气：[^\n]*\n/, '\n');
    body = body.trim();
    const withTitle = `# ${title}\n\n${body}`;
    fs.writeFileSync(outPath, withTitle, 'utf-8');
    exported++;
  }

  console.log(`Exported ${exported} diaries (${imagesCopied} images) to:`);
  console.log(OUT_DIR);
  db.close();
})().catch(err => { console.error(err); process.exit(1); });
