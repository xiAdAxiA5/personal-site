import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'public', 'followers.json');

async function fetchGitHub() {
  const res = await fetch('https://api.github.com/users/xiAdAxiA5', {
    headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'personal-site-bot' },
  });
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  const d = await res.json();
  return d.followers;
}

async function fetchBilibili() {
  const res = await fetch(
    'https://api.bilibili.com/x/relation/stat?vmid=507685526',
    { headers: { Referer: 'https://space.bilibili.com' } },
  );
  if (!res.ok) throw new Error(`Bilibili HTTP ${res.status}`);
  const j = await res.json();
  if (j.code !== 0) throw new Error(`Bilibili API: ${j.message}`);
  return j.data.follower;
}

async function fetchYouTube() {
  const res = await fetch('https://www.youtube.com/@xiAdAxiA5', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; personal-site-bot/1.0)',
      'Accept-Language': 'en-US',
    },
  });
  if (!res.ok) throw new Error(`YouTube HTTP ${res.status}`);
  const html = await res.text();

  // Method 1: JSON-LD structured data
  const ldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  if (ldMatch) {
    try {
      const ld = JSON.parse(ldMatch[1]);
      const stats = ld?.author?.interactionStatistic || ld?.interactionStatistic;
      if (stats) {
        for (const s of stats) {
          if (/subscribe/i.test(s.interactionType || '')) {
            const c = parseInt(s.userInteractionCount, 10);
            if (!isNaN(c)) return c;
          }
        }
      }
    } catch { /* JSON parse failed */ }
  }

  // Method 2: ytInitialData extraction
  const ytMatch = html.match(/var\s+ytInitialData\s*=\s*(\{.+?\});<\/script>/s);
  if (ytMatch) {
    try {
      const data = JSON.parse(ytMatch[1]);
      const text =
        data?.header?.c4TabbedHeaderRenderer?.subscriberCountText?.simpleText;
      if (text) return parseCount(text);
    } catch { /* JSON parse failed */ }
  }

  // Method 3: simpleText pattern in raw HTML
  const subMatch = html.match(/"subscriberCountText"\s*:\s*\{[^}]*"simpleText"\s*:\s*"([^"]+)"/);
  if (subMatch) return parseCount(subMatch[1]);

  throw new Error('Could not extract subscriber count');
}

function parseCount(text) {
  const cleaned = text.replace(/\s*subscribers?\s*/i, '').trim();
  const num = parseFloat(cleaned.replace(/,/g, ''));
  if (isNaN(num)) return 0;
  if (/[Kk]$/.test(cleaned)) return Math.round(num * 1000);
  if (/[Mm]$/.test(cleaned)) return Math.round(num * 1_000_000);
  return Math.round(num);
}

async function main() {
  const results = {};

  const tasks = [
    { key: 'github', fn: fetchGitHub },
    { key: 'bilibili', fn: fetchBilibili },
    { key: 'youtube', fn: fetchYouTube },
  ];

  for (const { key, fn } of tasks) {
    try {
      results[key] = await fn();
      console.log(`[${key}] ${results[key]}`);
    } catch (e) {
      results[key] = null;
      console.error(`[${key}] ERROR: ${e.message}`);
    }
  }

  // Douyin has no public API; set the value manually when you know it
  results.douyin = null;

  writeFileSync(OUT, JSON.stringify(results, null, 2) + '\n');
  console.log(`\nWritten to ${OUT}`);
}

main();
