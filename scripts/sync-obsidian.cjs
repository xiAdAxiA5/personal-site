const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = 'D:\\杂物\\obsidian\\cangku\\大虾\\knowledge';
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'obsidian-knowledge.ts');
const PUBLIC_IMAGES = path.join(__dirname, '..', 'public', 'obsidian');

// Exit gracefully if vault not found
if (!fs.existsSync(KNOWLEDGE_DIR)) {
  console.warn(`⚠ Obsidian vault not found at: ${KNOWLEDGE_DIR}`);
  console.warn('Skipping sync — blog will show empty state.');
  process.exit(0);
}

// Ensure output dirs exist
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
if (!fs.existsSync(PUBLIC_IMAGES)) fs.mkdirSync(PUBLIC_IMAGES, { recursive: true });

const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.md'));

// Stats for date extraction
const posts = files.map((file) => {
  const raw = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf-8');
  const stat = fs.statSync(path.join(KNOWLEDGE_DIR, file));
  const slug = file.replace('.md', '').replace(/\s+/g, '-').toLowerCase();

  // Extract title from first # heading, or use filename
  let title = file.replace('.md', '');
  let content = raw;

  const h1Match = raw.match(/^#\s+(.+)$/m);
  if (h1Match) {
    title = h1Match[1];
    // Remove the title line from content (it'll be rendered as the blog post title)
    content = raw.replace(/^#\s+.+\n?/, '');
  }

  // Handle Obsidian image embeds ![[image.png]] or ![[image.png|size]] (BEFORE wikilinks)
  content = content.replace(/!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]/g, (_m, imgName) => {
    const srcPath = path.join(KNOWLEDGE_DIR, '..', 'attachments', imgName);
    if (fs.existsSync(srcPath)) {
      const safeName = imgName.replace(/\s+/g, '_');
      const destPath = path.join(PUBLIC_IMAGES, safeName);
      fs.copyFileSync(srcPath, destPath);
      return `![${imgName}](/obsidian/${encodeURIComponent(safeName)})`;
    }
    return `[图片: ${imgName}]`;
  });

  // Handle Obsidian wikilinks [[page]] → link or **bold**
  content = content.replace(/\[\[([^\]|]+?)\]\]/g, (_m, p) => {
    // Check if it references a knowledge page
    const linkedFile = p + '.md';
    if (files.includes(linkedFile)) {
      const linkedSlug = p.replace(/\s+/g, '-').toLowerCase();
      return `[${p}](/blog/${linkedSlug})`;
    }
    return `**${p}**`;
  });

  // Clean up leading/trailing whitespace
  content = content.trim();

  // Estimate read time
  const wordCount = content.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 400));

  // Use file modification date
  const date = stat.mtime.toISOString().split('T')[0];

  // Escape backticks and template literals in content
  const escapedContent = content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  return { slug, title, content: escapedContent, date, readTime };
});

// Generate TypeScript file
let output = `// Auto-generated from Obsidian vault — do not edit manually
// Generated at ${new Date().toISOString()}

export interface ObsidianNote {
  slug: string;
  title: string;
  content: string;
  date: string;
  readTime: number;
}

export const obsidianNotes: ObsidianNote[] = [
`;

posts.forEach((p) => {
  output += `  {
    slug: '${p.slug}',
    title: '${p.title.replace(/'/g, "\\'")}',
    content: \`${p.content}\`,
    date: '${p.date}',
    readTime: ${p.readTime},
  },\n`;
});

output += '];\n';

fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
console.log(`✓ Synced ${posts.length} knowledge notes from Obsidian vault`);
posts.forEach(p => console.log(`  - ${p.title} (${p.readTime} min read)`));
