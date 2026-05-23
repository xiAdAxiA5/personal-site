// Batch: search NetEase API for metadata, then generate music.ts
// Usage: npx tsx scripts/fetch-songs.ts > src/data/music-generated.ts

const BASE = 'https://music.163.com/api';

interface SongMeta {
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  albumId: number;
  songId: number;
}

async function search(keyword: string, artistHint?: string) {
  const q = artistHint ? `${artistHint} ${keyword}` : keyword;
  const url = `${BASE}/search/get?s=${encodeURIComponent(q)}&type=1&limit=10`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const data = await res.json();
  if (data.code !== 200 || !data.result?.songs?.length) return null;

  // Prefer result matching the original artist, then highest album size (more likely original)
  const songs = data.result.songs;
  // Score: prefer songs from larger albums (originals have full albums, covers are singles)
  const scored = songs.map((s: any) => ({
    ...s,
    score: (s.album?.size || 1) + (s.artists?.[0]?.name === artistHint ? 50 : 0),
  }));
  scored.sort((a: any, b: any) => b.score - a.score);
  return scored[0];
}

function fmtDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

async function main() {
  // Song list with artist hints for known artists
  const queue: { keyword: string; artist?: string }[] = [
    { keyword: '一个人默默的酷', artist: '公馆青少年' },
    { keyword: '要不要跟我出去走一走', artist: '公馆青少年' },
    { keyword: '水星记', artist: '郭顶' },
    { keyword: '你啊你啊', artist: '魏如萱' },
    { keyword: '我怀念的', artist: '孙燕姿' },
    { keyword: '爱情转移', artist: '陈奕迅' },
    { keyword: '情歌', artist: '梁静茹' },
    { keyword: '太聪明', artist: '陈绮贞' },
    { keyword: '冬眠', artist: '阿YueYue' },
    { keyword: '第三人称' },
    { keyword: '无人之岛', artist: '任然' },
    { keyword: '疑心病', artist: '任然' },
    { keyword: '浪子回头', artist: '茄子蛋' },
    { keyword: '演员', artist: '薛之谦' },
    { keyword: '天外来物', artist: '薛之谦' },
    { keyword: '像风一样', artist: '薛之谦' },
    { keyword: '天份', artist: '薛之谦' },
    { keyword: '哑巴', artist: '薛之谦' },
    { keyword: '江南', artist: '林俊杰' },
    { keyword: 'Always Online', artist: '林俊杰' },
    { keyword: '当你', artist: '林俊杰' },
    { keyword: '飞机场的 10:30', artist: '陶喆' },
    { keyword: '普通朋友', artist: '陶喆' },
    { keyword: '特别的人', artist: '方大同' },
    { keyword: '爱爱爱', artist: '方大同' },
    { keyword: '麦恩莉', artist: '方大同' },
    { keyword: '才二十三', artist: '方大同' },
    { keyword: '红豆', artist: '王菲' },
    { keyword: '小小虫', artist: '方大同' },
    { keyword: 'BB88', artist: '方大同' },
    { keyword: '爱在', artist: '方大同' },
    { keyword: '星晴', artist: '周杰伦' },
    { keyword: '印地安老斑鸠', artist: '周杰伦' },
    { keyword: '龙卷风', artist: '周杰伦' },
    { keyword: '反方向的钟', artist: '周杰伦' },
    { keyword: '爱在西元前', artist: '周杰伦' },
    { keyword: '简单爱', artist: '周杰伦' },
    { keyword: '忍者', artist: '周杰伦' },
    { keyword: '开不了口', artist: '周杰伦' },
    { keyword: '上海一九四三', artist: '周杰伦' },
    { keyword: '安静', artist: '周杰伦' },
    { keyword: '半岛铁盒', artist: '周杰伦' },
    { keyword: '暗号', artist: '周杰伦' },
    { keyword: '爷爷泡的茶', artist: '周杰伦' },
    { keyword: '回到过去', artist: '周杰伦' },
    { keyword: '以父之名', artist: '周杰伦' },
    { keyword: '晴天', artist: '周杰伦' },
    { keyword: '东风破', artist: '周杰伦' },
    { keyword: '你听得到', artist: '周杰伦' },
    { keyword: '她的睫毛', artist: '周杰伦' },
    { keyword: '七里香', artist: '周杰伦' },
    { keyword: '借口', artist: '周杰伦' },
    { keyword: '搁浅', artist: '周杰伦' },
    { keyword: '园游会', artist: '周杰伦' },
    { keyword: '止战之殇', artist: '周杰伦' },
    { keyword: '夜曲', artist: '周杰伦' },
    { keyword: '发如雪', artist: '周杰伦' },
    { keyword: '枫', artist: '周杰伦' },
    { keyword: '浪漫手机', artist: '周杰伦' },
    { keyword: '麦芽糖', artist: '周杰伦' },
    { keyword: '珊瑚海', artist: '周杰伦' },
    { keyword: '一路向北', artist: '周杰伦' },
    { keyword: '夜的第七章', artist: '周杰伦' },
    { keyword: '听妈妈的话', artist: '周杰伦' },
    { keyword: '退后', artist: '周杰伦' },
    { keyword: '白色风车', artist: '周杰伦' },
    { keyword: '菊花台', artist: '周杰伦' },
    { keyword: '牛仔很忙', artist: '周杰伦' },
    { keyword: '彩虹', artist: '周杰伦' },
    { keyword: '青花瓷', artist: '周杰伦' },
    { keyword: '蒲公英的约定', artist: '周杰伦' },
    { keyword: '我不配', artist: '周杰伦' },
    { keyword: '最长的电影', artist: '周杰伦' },
    { keyword: '花海', artist: '周杰伦' },
    { keyword: '说好的幸福呢', artist: '周杰伦' },
    { keyword: '兰亭序', artist: '周杰伦' },
    { keyword: '稻香', artist: '周杰伦' },
    { keyword: '说了再见', artist: '周杰伦' },
    { keyword: '烟花易冷', artist: '周杰伦' },
    { keyword: '好久不见', artist: '周杰伦' },
    { keyword: '雨下一整晚', artist: '周杰伦' },
    { keyword: '我落泪・情绪零碎', artist: '周杰伦' },
    { keyword: '爱的飞行日记', artist: '周杰伦' },
    { keyword: 'Mine Mine', artist: '周杰伦' },
    { keyword: '疗伤烧肉粽', artist: '周杰伦' },
    { keyword: '红尘客栈', artist: '周杰伦' },
    { keyword: '乌克丽丽', artist: '周杰伦' },
    { keyword: '手写的从前', artist: '周杰伦' },
    { keyword: '颁奖的时候我要缺席', artist: '裘德' },
    { keyword: '老古董', artist: '裘德' },
    { keyword: '瑞贝卡', artist: '裘德' },
    { keyword: 'K 先生', artist: '裘德' },
    { keyword: '莫比乌斯号的船医', artist: '裘德' },
    { keyword: '弟弟', artist: '裘德' },
    { keyword: '黑乌鸦和少女', artist: '裘德' },
    { keyword: '北海道恋人', artist: '裘德' },
    { keyword: '伊始', artist: '裘德' },
    { keyword: '胚胎', artist: '裘德' },
    { keyword: '练声曲', artist: '裘德' },
    { keyword: '色盲', artist: '裘德' },
    { keyword: '今天吃点什么好', artist: '裘德' },
    { keyword: '斯德哥尔摩难题', artist: '裘德' },
    { keyword: '体无完肤', artist: '裘德' },
    { keyword: '麻烦删掉狮子座', artist: '裘德' },
    { keyword: '饥饿女士', artist: '裘德' },
    { keyword: '瘸子之舞', artist: '裘德' },
    { keyword: '缺氧', artist: '裘德' },
    { keyword: '骨骼谢幕', artist: '裘德' },
    { keyword: '荔枝', artist: '裘德' },
    { keyword: '椰子船', artist: '裘德' },
    { keyword: '薛定谔果', artist: '裘德' },
    { keyword: '香格里拉', artist: '裘德' },
    { keyword: '变色龙', artist: '裘德' },
    { keyword: '新手', artist: '裘德' },
    { keyword: 'Simon', artist: '裘德' },
    { keyword: '大年夜怪奇物语', artist: '裘德' },
    { keyword: 'Let Me Go', artist: '裘德' },
    { keyword: '后知后觉' },
    { keyword: '原来', artist: '林俊杰' },
    { keyword: '一生的爱', artist: '林俊杰' },
    { keyword: 'After 17', artist: '陈绮贞' },
    { keyword: '还是会寂寞', artist: '陈绮贞' },
    { keyword: '旅行的意义', artist: '陈绮贞' },
    { keyword: '鱼', artist: '陈绮贞' },
    { keyword: '我喜欢上你时的内心活动', artist: '陈绮贞' },
    { keyword: '小步舞曲', artist: '陈绮贞' },
    { keyword: '爱错' },
    { keyword: '我在纽约打电话给你' },
    { keyword: '飞鸟和蝉', artist: '任然' },
    { keyword: '三人游', artist: '方大同' },
    { keyword: '银色荒原' },
    { keyword: '火山灰' },
    { keyword: '春天的临终' },
    { keyword: '飞鸟在风暴中' },
    { keyword: '奇卡奇卡' },
    { keyword: '没有羊的牧羊人' },
    { keyword: '请求迷失在七月森林' },
    { keyword: '我们不要躲雨了' },
    { keyword: '寻找一片青草地' },
    { keyword: '你是我的风景' },
    { keyword: '想自由' },
    { keyword: '说谎', artist: '林宥嘉' },
    { keyword: '天真有邪', artist: '林宥嘉' },
    { keyword: '兜圈', artist: '林宥嘉' },
    { keyword: '刻在我心底的名字' },
    { keyword: '那个女孩' },
    { keyword: '几分之几' },
    { keyword: '有何不可', artist: '许嵩' },
    { keyword: '素颜', artist: '许嵩' },
    { keyword: '如果当时', artist: '许嵩' },
    { keyword: '留香' },
    { keyword: '飞鸽' },
    { keyword: '半空' },
    { keyword: 'Simon (Live)', artist: '裘德' },
    { keyword: '拆穿 (Live)', artist: '裘德' },
    { keyword: '颜色' },
    { keyword: '用背脊唱情歌' },
    { keyword: '国际孤独等级' },
    { keyword: '关于爱的定义' },
    { keyword: '低空鸟人' },
  ];

  const results: SongMeta[] = [];
  const notFound: string[] = [];

  for (let i = 0; i < queue.length; i++) {
    const { keyword, artist } = queue[i];
    process.stdout.write(`[${i + 1}/${queue.length}] ${artist ? artist + ' - ' : ''}${keyword} ... `);

    try {
      const song = await search(keyword, artist);
      if (!song) {
        console.log('NOT FOUND');
        notFound.push(keyword);
        continue;
      }

      const name = song.name;
      const artists = song.artists?.map((a: any) => a.name).join('/') || artist || '未知';
      const album = song.album?.name || '未知专辑';
      const cover = (song.album?.picUrl || '').replace('http:', 'https:');
      const duration = fmtDuration(song.duration || 0);
      const albumId = song.album?.id || 0;
      const songId = song.id || 0;

      results.push({ title: name, artist: artists, album, cover, duration, albumId, songId });
      console.log(`=> ${artists} [${album}] ${duration}`);
    } catch (e: any) {
      console.log('ERROR:', e.message);
      notFound.push(keyword);
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  // Print results as TS code
  console.log('\n\n// ===== GENERATED music data =====\n');
  console.log('export interface Track {');
  console.log('  title: string;');
  console.log('  duration: string;');
  console.log('  description: string;');
  console.log('  src?: string;');
  console.log('  lrc?: string;');
  console.log('}');
  console.log('');
  console.log('export interface Album {');
  console.log('  id: string;');
  console.log('  title: string;');
  console.log('  artist: string;');
  console.log('  cover: string;');
  console.log('  genre: string;');
  console.log('  tracks: Track[];');
  console.log('}');
  console.log('');

  // Group by album
  const groups = new Map<string, SongMeta[]>();
  for (const r of results) {
    const key = r.album;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  console.log('export const albums: Album[] = [');
  let albumIdx = 1;
  for (const [albumName, tracks] of groups) {
    const first = tracks[0];
    console.log('  {');
    console.log(`    id: '${albumIdx++}',`);
    console.log(`    title: '${albumName}',`);
    console.log(`    artist: '${first.artist}',`);
    console.log(`    cover: '${first.cover}',`);
    console.log(`    genre: 'Pop',`);
    console.log('    tracks: [');
    for (const t of tracks) {
      console.log(`      { title: '${t.title}', duration: '${t.duration}', description: '暂无版权', src: '', lrc: '' },`);
    }
    console.log('    ],');
    console.log('  },');
  }
  console.log('];');

  // Print not found
  if (notFound.length > 0) {
    console.log('\n// NOT FOUND:');
    for (const nf of notFound) {
      console.log(`//   ${nf}`);
    }
  }
}

main();
