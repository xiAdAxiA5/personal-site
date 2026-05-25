const fs = require('fs');

// Record and fix track lists
const fetch = globalThis.fetch;

async function searchAlbum(query) {
  const url = `https://music.163.com/api/search/get?s=${encodeURIComponent(query)}&type=10&limit=5`;
  const res = await fetch(url, {
    headers: { 'Referer': 'https://music.163.com', 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await res.json();
  return data.result?.albums || [];
}

async function getAlbumTracks(albumId) {
  const url = `https://music.163.com/api/album/${albumId}`;
  const res = await fetch(url, {
    headers: { 'Referer': 'https://music.163.com', 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await res.json();
  return data.album?.songs || [];
}

async function main() {
  // 1. Search for "我其实一点都不酷"
  console.log('Searching: 我其实一点都不酷 公馆青少年');
  const albums = await searchAlbum('我其实一点都不酷 公馆青少年');
  for (const a of albums) {
    console.log(`  Album: ${a.id} - ${a.name} (${a.artist?.name}, ${a.size} tracks)`);
  }

  // 2. Search for "天外来物" for reference
  console.log('\nSearching: 天外来物 薛之谦');
  const albums2 = await searchAlbum('天外来物 薛之谦');
  for (const a of albums2) {
    console.log(`  Album: ${a.id} - ${a.name} (${a.artist?.name}, ${a.size} tracks)`);
  }
}

main().catch(console.error);
