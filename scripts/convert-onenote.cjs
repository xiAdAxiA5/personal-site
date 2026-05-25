const fs = require('fs');
const path = require('path');

const MHT_FILE = 'C:\\Users\\75815\\Desktop\\111\\onenote导出\\pure imagination.mht';
const OUT_DIR = 'D:\\杂物\\obsidian\\cangku\\大虾\\onenote';
const ATTACH_DIR = 'D:\\杂物\\obsidian\\cangku\\大虾\\attachments';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(ATTACH_DIR, { recursive: true });

// Read raw buffer, work in latin1 to avoid corrupting bytes
const buf = fs.readFileSync(MHT_FILE);
// latin1: each byte 0-255 maps 1:1 to a unicode codepoint, no corruption
const raw = buf.toString('latin1');

const boundary = '------=_NextPart_01DCEB7B.5406F880';
const parts = raw.split(boundary);

// ---- Part 1: HTML (quoted-printable) ----
const htmlPart = parts.find(p => p.includes('Content-Type: text/html'));
const headerEnd = htmlPart.indexOf('\r\n\r\n');
let qpText = htmlPart.slice(headerEnd).trim();
qpText = qpText.replace(/------=_NextPart.*$/s, '').trim();

// quoted-printable decode on latin1 string
function qpDecode(str) {
  // Remove soft line breaks (= at end of line)
  str = str.replace(/=\r?\n/g, '');
  // Decode =XX to actual byte values (still in latin1)
  str = str.replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return str;
}

const latin1Decoded = qpDecode(qpText);

// Now convert from latin1 (bytes) to proper UTF-8 string
const html = Buffer.from(latin1Decoded, 'latin1').toString('utf-8');

// ---- Parts 2-10: Base64 images ----
parts.filter(p => p.includes('Content-Type: image')).forEach(part => {
  const locMatch = part.match(/Content-Location:.*?([^\/\\]+\.png)/i);
  const dataStart = part.indexOf('\r\n\r\n');
  if (!locMatch || dataStart === -1) return;
  const name = locMatch[1].trim();
  const b64 = part.slice(dataStart).replace(/\s/g, '');
  const imgBuf = Buffer.from(b64, 'base64');
  if (imgBuf.length > 100) {
    fs.writeFileSync(path.join(ATTACH_DIR, name), imgBuf);
    console.log(`  [image] ${name}`);
  }
});

// ---- Helper ----
function stripTags(s) {
  return s.replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

// ---- Parse OneNote pages ----
const pageRx = /<div style='direction:ltr;border-width:100%'>([\s\S]*?)(?=<div style='direction:ltr;border-width:100%'>|已使用 OneNote)/g;
const pages = [...html.matchAll(pageRx)];

console.log(`Pages found: ${pages.length}`);

let noteCount = 0;

pages.forEach(m => {
  const block = m[1];

  // Strip tags for text extraction
  const plain = stripTags(block);
  const dateMatch = plain.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!dateMatch) return;
  const date = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;

  // Extract content paragraphs
  const pRx = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const lines = [];
  let pm;
  while ((pm = pRx.exec(block)) !== null) {
    let text = stripTags(pm[1]).trim();
    if (!text) continue;
    if (/^\d{4}年\d{1,2}月\d{1,2}日$/.test(text)) continue;
    if (/^\d{2}:\d{2}$/.test(text)) continue;
    // Clean up remaining garbage
    text = text.replace(/[�]/g, '').trim();
    if (!text) continue;
    lines.push(text);
  }
  if (lines.length === 0) return;

  // First meaningful line as title
  const title = lines[0].slice(0, 40) + (lines[0].length > 40 ? '...' : '');
  const content = lines.join('\n\n');

  // Safe filename from title
  const safeTitle = title.replace(/[\/\\:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
  const filename = `${date} ${safeTitle}.md`;

  const md = `# ${title}\n\n${content}`;
  fs.writeFileSync(path.join(OUT_DIR, filename), md, 'utf-8');
  console.log(`  ${filename}`);
  noteCount++;
});

console.log(`\nDone! ${noteCount} notes → ${OUT_DIR}`);
