// Fetch NetEase Cloud Music song IDs for tracks in music.ts
// Usage: node scripts/fetch-netease-ids.cjs
// This searches NetEase API for each track and adds neteaseId to music.ts

const fs = require('fs');
const path = require('path');

const MUSIC_FILE = path.join(__dirname, '..', 'src', 'data', 'music.ts');
const CACHE_FILE = path.join(__dirname, '..', 'scripts', '.netease-cache.json');

// Load existing cache
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
}

async function searchSong(artist, title) {
  const key = `${artist} - ${title}`;
  if (cache[key]) return cache[key];

  const query = encodeURIComponent(`${artist} ${title}`);
  const url = `https://music.163.com/api/search/get?s=${query}&type=1&limit=3`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://music.163.com',
      },
    });
    const data = await res.json();
    if (data.result && data.result.songs && data.result.songs.length > 0) {
      // Pick the best match: prefer exact artist match
      let song = data.result.songs[0];
      for (const s of data.result.songs) {
        const songArtist = (s.artists || []).map(a => a.name).join('/');
        if (songArtist.includes(artist) || artist.includes(songArtist)) {
          song = s;
          break;
        }
      }
      cache[key] = song.id;
      console.log(`  ✓ ${key} → ${song.id} (${song.name})`);
      return song.id;
    }
    console.log(`  ✗ ${key} → not found`);
    return null;
  } catch (e) {
    console.log(`  ✗ ${key} → error: ${e.message}`);
    return null;
  }
}

async function main() {
  // Parse music.ts to extract tracks without src and without neteaseId
  const content = fs.readFileSync(MUSIC_FILE, 'utf-8');

  // Find all album blocks
  const trackRegex = /\{\s*title:\s*'([^']+)',\s*duration:\s*'[^']*',\s*description:\s*'[^']*'(?:,\s*src:\s*'[^']*')?(?:,\s*nateaseId:\s*(\d+))?\s*\}/g;

  // Simpler approach: read the file, find tracks without neteaseId and without src
  const lines = content.split('\n');
  const tracks = [];
  let currentAlbum = { title: '', artist: '' };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Detect album title/artist
    const titleMatch = line.match(/title:\s*'([^']+)'/);
    const artistMatch = line.match(/artist:\s*'([^']+)'/);
    if (titleMatch && line.includes('id:')) {
      // This is an album title line
    }
    if (artistMatch && !line.includes('tracks')) {
      currentAlbum.artist = artistMatch[1];
    }

    // Detect track entries
    const trackMatch = line.match(/\{\s*title:\s*'([^']+)'/);
    if (trackMatch && !line.includes('id:') && !line.includes('export')) {
      const hasSrc = line.includes("src:");
      const hasNeteaseId = line.includes('neteaseId');
      if (!hasSrc && !hasNeteaseId) {
        tracks.push({ artist: currentAlbum.artist, title: trackMatch[1], lineIndex: i });
      }
    }
  }

  console.log(`Found ${tracks.length} tracks without audio source\n`);

  if (tracks.length === 0) {
    console.log('All tracks already have src or neteaseId. Nothing to do.');
    return;
  }

  let added = 0;
  for (const track of tracks) {
    const id = await searchSong(track.artist, track.title);
    if (id) {
      // Add neteaseId to the track line
      const oldLine = lines[track.lineIndex];
      if (oldLine.includes('neteaseId')) continue;
      // Insert neteaseId after description or duration
      const newLine = oldLine.replace(
        /(description:\s*'[^']*')(\s*\})/,
        `$1, neteaseId: ${id}$2`
      ).replace(
        /(duration:\s*'[^']*')(\s*\})/,
        `$1, neteaseId: ${id}$2`
      );
      if (newLine !== oldLine) {
        lines[track.lineIndex] = newLine;
        added++;
      }
    }
    // Rate limit
    await new Promise(r => setTimeout(r, 500));
  }

  if (added > 0) {
    fs.writeFileSync(MUSIC_FILE, lines.join('\n'), 'utf-8');
    console.log(`\n✓ Added neteaseId to ${added} tracks`);
  }

  // Save cache
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

main().catch(console.error);
